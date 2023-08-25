import jwt from 'jsonwebtoken';
import User from '../models/user.js'

// utilities
import MyErrors from '../utils/errorUtils.js';

const requireAuth = async (req, res, next) => {
   // verify authentication
   const { authentication } = req.headers;

   if (!authentication) {
      return res.status(401).json({ error: 'Access denied, you need to login.' });
   };

   const token = authentication.split(' ')[1];

   try {
      const { _id } = jwt.verify(token, process.env.SECURE);

      req.user = await User.findOne({ _id }).select('_id isAdmin roles');
      next();
   }
   catch (error) {
      console.log(error);
      res.status(401).json({ error: 'Request denied' });
   };

};

export { requireAuth };