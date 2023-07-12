import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';

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
   return jwt.sign({ _id }, process.env.SECURE, { expiresIn: '5d' });
};

const registerToken = (userId) => {
   return jwt.sign(
      { userId },
      process.env.EMAIL_TOKEN_SECURE,
      { expiresIn: '1d' }
   );
};

// when the homepage refeshes, it checks browser's localStorage for a tocken
// once the token is verified, user is granted access.
// else, no token or malformed token, redirects to login
const loginUser = async (req, res) => {
   const error = { server: { message: 'Request denied.' } };

   // verify authentication if a token is present
   const { authentication } = req.headers;

   if (authentication) {
      const token = authentication.split(' ')[1];

      try {
         const { _id } = jwt.verify(token, process.env.SECURE);

         const user = await User.findOne({ _id });

         // user model will remove password when sending json
         return res.status(200).json(user);
      }
      catch (err) {
         console.log(err);

         return res.status(401).json({ error });
      };
   };

   const { email, password } = req.body;

   try {
      const user = await User.login(email, password);

      // create a token
      const token = loginToken(user._id);

      return res.status(200).json({ user, token });
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

const verifyEmailToken = async (req, res) => {
   const { emailToken } = req.params;
   const { resetPassword } = req.params;

   try {
      const { userId: _id } = jwt.verify(emailToken, process.env.EMAIL_TOKEN_SECURE);

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

// send an email to the email address provided
const sendEmailResetPasswordLink = async (req, res) => {
   const error = { server: { message: 'No such email' } };
   const { email } = req.body;

   try {
      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ error });

      const token = registerToken(user._id);

      await sendResetPasswordLink({
         firstName: user.firstName,
         email,
         token,
      });

      console.log(`${user.firstName} has forgotten their password, an email has been sent to ${email}.`);

      return res.status(200).json(user);
   }
   catch (err) {
      console.error(err);

      return res.status(404).json({ error });
   }
}

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