import mongoose from "mongoose";
import User from "../models/user.js";
import JWT from 'jsonwebtoken';

// services
import { sendResetPasswordLink, sendVerifyEmailRequest } from '../services/email.js';

// error handlers
import {
   DocumentNotFoundError,
   EmailVerificationError,
   EmptyStringError,
   MalformedTokenError,
   TokenExpiredError,
   WrongPasswordError
} from '../utils/errorHandlingUtils.js';

const loginToken = (_id) => {
   return JWT.sign({ _id }, process.env.SECURE, { expiresIn: '5d' });
};

const registerToken = (userId) => {
   return JWT.sign(
      { userId },
      process.env.EMAIL_TOKEN_SECURE,
      { expiresIn: '1d' }
   );
};

// log in an authenticated user
const loginUser = async (req, res, next) => {
   const { authentication } = req.headers;
   const { email, password } = req.body;

   // a valid token means the user has already been authenticated
   if (authentication) {
      const key = process.env.SECURE;
      const token = authentication.split(' ')[1];

      JWT.verify(token, key, async (error, decoded) => {
         if (error) {
            if (error.name === 'TokenExpiredError') return next(new TokenExpiredError());

            return next(new MalformedTokenError());
         };

         const user = await User.findOne({ _id: decoded });

         return res.status(200).json(user);
      });
   }
   else {
      // must include an email and password for the user
      if (!email || !password) return next(new EmptyStringError(!email ? 'email' : 'password'));

      // verifies user's credentials
      const user = await User.authenticate(email, password);

      // throw error if no user is found, wrong password, or user has not verified their email
      // throw a wrong password error for no user found to not reveal if an email exists
      if (!user) console.error(`User not found with email (${email}) sending 'Wrong Password Error' to not reveal existance of user.`);
      if (!user || user.wrongPassword) return next(new WrongPasswordError());
      if (!user.isVerified) return next(new EmailVerificationError());

      // create a token
      const token = loginToken(user._id);
      return res.status(200).json({ user, token });
   };
};

const verifyEmailToken = async (req, res) => {
   const { emailToken } = req.params;
   const { resetPassword } = req.params;

   try {
      const { userId: _id } = JWT.verify(emailToken, process.env.EMAIL_TOKEN_SECURE);

      const user = await User.findById(_id);

      if (!user) throw { user: 'No user found.' };

      // when the user forgets password, their email inbox will have a message with link that will route them here to set their password null and unverify them until they set a new password
      if (resetPassword === '1') {
         user.password = null;
         user.isVerified = false;
         await user.save();
      }

      // when the user or admin updates a user's email, the user is unverified and sent a message to the updated email requesting to verify the email address by clicking on the provided link. When a user verifies, and has a set password, then there's no need to go through the sign up process. then just verify the user.
      if (user.password) {
         user.isVerified = true;
         await user.save();
      };

      return res.status(200).json(user);
   }
   catch (err) {
      const error = {};
      console.error(err);

      // error for tokens over their 1h expiration
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
         error.token = { message: 'Email token link is invalid.' };
      };

      if (err.user) {
         error.message = err.user;
      };

      return res.status(400).json({ error });
   };


}

// set user.isVerified to true and set their password
const verifyUser = async (req, res) => {
   const { _id, password, confirmPassword } = req.body;

   try {
      const user = await User.changePassword({ _id, password, confirmPassword });

      user.isVerified = true;

      await user.save();

      return res.status(200).json(user);
   }
   catch (err) {
      console.error(err);

      // 'errors' contains any mongoose model-validation fails
      const { errors } = err;

      // if no input errors, then send back the err message as a server error
      if (!errors) {
         err.errors = {
            server: { message: err.message }
         };
      };

      return res.status(400).json({ error: err.errors });
   };
};

// create a new user
const registerUser = async (req, res) => {
   const { email, firstName } = req.body;

   try {
      const user = await User.create({
         ...req.body
      });

      const token = registerToken(user._id);

      await sendVerifyEmailRequest({ firstName, email, token });

      return res.status(200).json(user);
   }
   catch (err) {
      console.error(err);

      // 'errors' contains any mongoose model-validation fails
      const { errors } = err;

      // if no input errors, then send back the err message as a server error
      if (!errors) {
         err.errors = {
            server: { message: err.message }
         };
      };

      return res.status(400).json({ error: err.errors });
   };
};

// get all users
const getUsers = async (req, res) => {
   const users = await User.find({});

   return res.status(200).json(users);
};

// get a user
const getUser = async (req, res) => {
   const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such user.' });
   };

   const user = await User.findById(id);

   if (!user) {
      return res.status(404).json({ error: 'No such user.' });
   };

   res.status(200).json(user);
};

// delete a user
const deleteUser = async (req, res) => {
   const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such user.' });
   };

   const user = await User.findByIdAndDelete({ _id: id });

   if (!user) {
      return res.status(404).json({ error: 'No such user.' });
   };

   return res.status(200).json(user);
};

// send an email with a link to the email provided, when the user clicks on the link, they become unverified, which will have them set a new password when they try to login
const sendEmailResetPasswordLink = async (req, res, next) => {
   const { email } = req.body;

   if (!email.trim()) return next(new EmptyStringError('Email'));

   const user = await User.findOne({ email });
   if (!user) {
      console.error(`Email ${email} was not found, cannot send a request for verification. Sending ok response to client to not reveal resources.`);

      return res.status(200).json({});
   };

   const token = registerToken(user._id);
   sendResetPasswordLink({
      firstName: user.firstName,
      email,
      token,
   })
      .then((emailSent) => {
         if (emailSent) console.log(`${user.firstName} has forgotten their password, an email has been sent to ${email}.`);
         return res.status(200).json(user);
      });
};

// update a user
const updateUser = async (req, res) => {
   const { id } = req.params;
   const { email } = req.body;
   const error = { server: { message: 'No such user.' } };

   if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error });
   };

   try {
      const user = await User.findByIdAndUpdate(
         { _id: id },
         { ...req.body },
         {
            returnDocument: 'after',
            runValidators: true
         }
      );

      if (!user) {
         return res.status(404).json({ error });
      };

      // if the email is being updated, unverify the user to require them to verify the new email address
      if (email) {
         user.isVerified = false;
         await user.save();

         const token = registerToken(user._id);
         await sendVerifyEmailRequest({ firstName: user.firstName, email, token });
      };

      res.status(200).json(user);
   }
   catch (err) {
      console.error(err);

      const { errors: error } = err;

      // if no input errors, then send back the err message as a server error
      if (!error) {
         error = {};
         error.server = err.message;
      };

      return res.status(400).json({ error });
   }
};

export {
   deleteUser,
   getUser,
   getUsers,
   loginUser,
   registerUser,
   sendEmailResetPasswordLink,
   updateUser,
   verifyUser,
   verifyEmailToken
};