import JWT from 'jsonwebtoken';

// utitlites
import MyErrors from '../utils/errorUtils.js';

const secureKey = process.env.SECURE;
const secureEmailKey = process.env.EMAIL_TOKEN_SECURE;


export const createJWT = (data, expiresIn) => {
   return JWT.sign({ ...data }, secureKey, { expiresIn });
};

export const decodeJWT = (token) => {
   try {
      return JWT.verify(token, secureKey);
   }
   catch (error) { throw MyErrors.jwtInvalid(error.name) };
};
