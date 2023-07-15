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
   PasswordNotStrongError,
   PasswordsDoNotMatch,
   TokenExpiredError,
   WrongPasswordError,
} from '../utils/errorHandlingUtils.js';

const loginToken = (_id) => {
   return JWT.sign({ _id }, process.env.SECURE, { expiresIn: '5d' });
};

const registerToken = (userId) => {
   return JWT.sign(
      { userId },
      process.env.EMAIL_TOKEN_SECURE,
      { expiresIn: '1h' }
   );
};

// log in an authenticated user
const loginUser = async (req, res, next) => {
   const { authentication } = req.headers;
   const { email, password } = req.body;

   try {
      // a valid token means the user has already been authenticated
      if (authentication) {
         const key = process.env.SECURE;
         const token = authentication.split(' ')[1];

         JWT.verify(token, key, async (error, decoded) => {
            if (error) {
               if (error.name === 'TokenExpiredError') throw new TokenExpiredError();

               throw new MalformedTokenError();
            };

            const user = await User.findOne({ _id: decoded });

            return res.status(200).json(user);
         });
      }
      else {
         // must include an email and password for the user
         if (!email || !password) throw new EmptyStringError(!email ? 'email' : 'password');

         const user = await User.findOne({ email });

         // throw error if no user is found, wrong password, or user has not verified their email
         // throw a wrong password error for no user found to not reveal if an email exists
         if (!user) {
            console.error(`User not found with email (${email}) sending 'Wrong Password Error' to not reveal existance of user.`);

            throw new WrongPasswordError();
         };

         if (!user.isVerified || !user.password) throw new EmailVerificationError();

         // authenticate by checking password
         const isAuthenticated = await User.authenticate(email, password);
         if (!isAuthenticated) throw new WrongPasswordError();

         // create a token
         const token = loginToken(user._id);
         return res.status(200).json({ user, token });
      };
   }
   catch (error) {
      next(error);
   }
};

const verifyEmailToken = async (req, res, next) => {
   const emailKey = process.env.EMAIL_TOKEN_SECURE;
   const { emailToken } = req.params;
   const { resetPassword } = req.params;

   try {
      const { userId } = JWT.verify(emailToken, emailKey);
      const user = await User.findById(userId);

      if (!user) throw new DocumentNotFoundError('User');

      // resetting password sets it to null and user becomes unverified. front end will require them to set up password all over again
      if (resetPassword === 'true') {
         user.password = null;
         user.isVerified = false;
         user.save();
      }

      // for new users who are clicking on the link in the email to verify their email address
      if (user.password) {
         user.isVerified = true;
         await user.save();
      };

      return res.status(200).json(user);

   } catch (error) {
      const { name } = error;

      if (name === 'TokenExpiredError' || name === 'SyntaxError') next(new MalformedTokenError());
      else if (name === 'JsonWebTokenError') next(new TokenExpiredError());
      else next(error);
   };
};

const verifyUser = async (req, res, next) => {
   let { _id, password, confirmPassword } = req.body;

   try {
      // client side handles input verification and this is an extra layer of protection
      if (!password.trim() || !confirmPassword.trim()) throw new EmptyStringError(!password.trim() ? 'Password' : 'Confirm Password');
      if (password !== confirmPassword) throw new PasswordsDoNotMatch();

      const user = await User.findById(_id);
      const result = await user.setEncryptedPassword(password);

      if (result.passwordNotStrong) throw new PasswordNotStrongError();
      user.isVerified = true;
      await user.save();

      return res.status(200).json(user);
   }
   catch (error) {
      next(error);
   };
};

// create a new user
const registerUser = async (req, res, next) => {
   let { email, firstName } = req.body;
   firstName = ''
   try {
      if (!firstName.trim()) throw new EmptyStringError('firstName', 'First Name', true);
      const user = await User.create({
         ...req.body
      });

      const token = registerToken(user._id);

      await sendVerifyEmailRequest({ firstName, email, token });

      return res.status(200).json(user);
   }
   catch (error) {
      next(error);
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