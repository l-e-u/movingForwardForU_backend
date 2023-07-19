import nodemailer from 'nodemailer';

const BASE_URL = process.env.BASE_URL;

const transporter = nodemailer.createTransport({
   service: 'gmail',
   host: 'smtp.gmail.com',
   secure: false,
   auth: {
      user: process.env.EMAIL_ACCOUNT_SENDER_T0_REGISTER_NEW_USER,
      pass: process.env.EMAIL_PASSWORD_SENDER_TO_REGISTER_NEW_USER
   }
});

export const sendVerifyEmailRequest = async ({ firstName, email, token }) => {
   try {
      await transporter.sendMail({
         from: process.env.EMAIL_ACCOUNT_SENDER_T0_REGISTER_NEW_USER,
         to: email,
         subject: `Moving Forward. ${firstName}, please complete your account set up.`,
         html: `Hello ${firstName},<br/><br/>The link below will have you set up your account, this link expires in one day after this message has been sent.<br />Please note, you must complete this step in order to login to Moving Forward. Contact us if this link expires.<br/><br/><a href="${BASE_URL}/verify/${token}/${firstName}/false">Go set up my account with Moving Forward.</a><br/><br/> Best regards,<br/>Moving Forward, LLC.`
      });

      return true;
   }
   catch (err) {
      console.error(err);
   };
};

export const sendResetPasswordLink = async ({ firstName, email, token }) => {
   try {
      await transporter.sendMail({
         from: process.env.EMAIL_ACCOUNT_SENDER_T0_REGISTER_NEW_USER,
         to: email,
         subject: `Moving Forward. You requested to reset your password.`,
         html: `Hello ${firstName},<br/><br/>The link below will reset your password, this link expires in one day after this message has been sent.<br />If you did not request this, you may ignore this message.<br/>Your account has not been changed.<br/>Please note, once you click the link, you'll have to set up your new password before you can login to Moving Forward. Contact us if this link expires.<br/><br/><a href="${BASE_URL}/verify/${token}/${firstName}/true">Reset my password with Moving Forward.</a><br/><br/> Best regards,<br/>Moving Forward, LLC.`
      });

      return true;
   }
   catch (err) {
      console.error(err);
   };
};