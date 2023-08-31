import jwt from 'jsonwebtoken';
import User from '../models/user.js'

// utilities
import MyErrors from '../utils/errorUtils.js';

const requireAuth = async (req, res, next) => {
   try {
      const { authentication } = req.headers;

      if (!authentication) throw MyErrors.jwtInvalid('No token.');

      const token = authentication.split(' ')[1];

      const { _id } = jwt.verify(token, process.env.SECURE);

      req.user = await User.findOne({ _id }).select('_id isAdmin roles');

      next();
   }
   catch (error) { next(error) };

};

export { requireAuth };