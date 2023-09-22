import { decodeJWT } from '../utils/jsonWebTokenUtils.js';

// whenever a new user is created, user forgets their password, or updates their email address, an email message is sent to their inbox with a link, that link will have a token that needs to be decoded successfully
export const decodeEmailToken = (req, res, next) => {
   const { emailToken } = req.body;

   try {
      const decodedToken = decodeJWT(emailToken);

      req.params.id = decodedToken._id;

      req.body.isVerified = true;

      if (decodedToken.resetPassword) req.body.password = null;

      next();

   } catch (error) { next(error) };
};