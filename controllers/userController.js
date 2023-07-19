import User from "../models/user.js";

// services
import { sendResetPasswordLink, sendVerifyEmailRequest } from '../services/email.js';

// utilities
import MyErrors from '../utils/errorUtils.js';
import { createJWT, decodeJWT } from '../utils/jsonWebTokenUtils.js';

// log in an authenticated user
const loginUser = async (req, res, next) => {
   const { authentication } = req.headers;
   const { email, password } = req.body;

   try {
      // a valid token means the user has already been authenticated
      if (authentication) {
         const token = authentication.split(' ')[1];

         const decodedToken = decodeJWT(token);

         const user = await User.findOne({ _id: decodedToken });
         if (!user) throw MyErrors.userNotFound();

         return res.status(200).json(user);
      }
      else {
         // must include an email and password for the user
         if (!email || !password) {
            throw MyErrors.valueRequired({
               fieldName: !email ? 'email' : 'password',
            });
         };

         const user = await User.findOne({ email });

         // throw error if no user is found, wrong password, or user has not verified their email
         // throw a wrong password error for no user found to not reveal if an email exists
         if (!user) {
            console.error(`User not found with email (${email}) sending 'Wrong Password Error' to not reveal existance of user.`);

            throw MyErrors.userNotFound({ id: email })
         };

         if (!user.isVerified) throw MyErrors.emailUnverified({ value: user.email });

         // authenticate by checking password
         const isAuthenticated = await User.authenticate(email, password);
         if (!isAuthenticated) throw MyErrors.invalidCredentials();

         // create a token
         const token = createJWT({ _id: user._id }, '5d');

         return res.status(200).json({ user, token });
      };
   }
   catch (error) { next(error) };
};

const verifyEmailToken = async (req, res, next) => {
   const { emailToken, resetPassword } = req.params;

   try {
      const decodedToken = decodeJWT(emailToken);
      const user = await User.findById(decodedToken);

      if (!user) throw MyErrors.userNotFound({ id: decodedToken })

      // resetting password sets it to null and user becomes unverified. front end will require them to set up password all over again
      if (resetPassword === 'true') {
         user.password = null;
         user.isVerified = false;
         await user.save();
      }

      // for new users who are clicking on the link in the email to verify their email address
      if (user.password) {
         user.isVerified = true;
         await user.save();
      };

      return res.status(200).json(user);

   } catch (error) { next(error) };
};

const verifyUser = async (req, res, next) => {
   let { _id, password, confirmPassword } = req.body;

   try {
      // client side handles input verification and this is an extra layer of protection
      if (!confirmPassword || !password) {
         throw MyErrors.valueRequired({
            fieldName: !confirmPassword ? 'confirmPassword' : 'password',
         });
      };

      if (password !== confirmPassword) throw MyErrors.passwordsDoNotMatch();

      const user = await User.findById(_id);
      const result = await user.setEncryptedPassword(password);

      if (result.passwordNotStrong) throw MyErrors.passwordNotStrong();
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

   try {
      const user = await User.create({ ...req.body });
      const token = createJWT({ _id: user._id }, '1h');

      await sendVerifyEmailRequest({ firstName, email, token });

      return res.status(200).json(user);
   }
   catch (error) { next(error) };
};

// get all users
const getUsers = async (req, res, next) => {
   try {
      const users = await User.find({});

      return res.status(200).json(users);
   }
   catch (error) { next(error) };
};

// get a user
const getUser = async (req, res, next) => {
   const { id } = req.params;

   try {
      const user = await User.findById(id);
      if (!user) throw MyErrors.userNotFound({ id })

      res.status(200).json(user);
   }
   catch (error) { next(error) }
};

// delete a user
const deleteUser = async (req, res, next) => {
   const { id } = req.params;

   try {
      const user = await User.findByIdAndDelete({ _id: id });
      if (!user) throw MyErrors.userNotFound({ id });

      return res.status(200).json(user);
   }
   catch (error) { next(error) }
};

// send an email with a link to the email provided, when the user clicks on the link, they become unverified, which will have them set a new password when they try to login
const sendEmailResetPasswordLink = async (req, res, next) => {
   const { email } = req.body;

   try {

      if (!email.trim()) throw MyErrors.valueRequired({ fieldName: 'Email' });

      const user = await User.findOne({ email });
      if (!user) {
         console.error(`Email ${email} was not found, cannot send a request for verification. Sending ok response to client to not reveal resources.`);

         return res.status(200).json({});
      };

      const token = createJWT({ _id: user._id }, '1h');

      const emailSent = await sendResetPasswordLink({
         firstName: user.firstName,
         email,
         token,
      })

      if (emailSent) {
         console.log(`${user.firstName} has forgotten their password, an email has been sent to ${email}.`);
      };

      return res.status(200).json(user);
   }
   catch (error) { next(error) }
};

// update a user
const updateUser = async (req, res, next) => {
   const { id } = req.params;
   const { email } = req.body;

   try {
      const user = await User.findByIdAndUpdate(
         { _id: id },
         { ...req.body },
         {
            returnDocument: 'after',
            runValidators: true
         }
      );

      if (!user) throw MyErrors.userNotFound({ id });

      // if the email is being updated, unverify the user to require them to verify the new email address
      if (email) {
         user.isVerified = false;
         await user.save();

         const token = createJWT({ id: user._id }, '1hr')

         await sendVerifyEmailRequest({ firstName: user.firstName, email, token });
      };

      res.status(200).json(user);
   }
   catch (error) { next(error) }
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