import mongoose from 'mongoose';

// utilities
import { deleteAttachments } from '../utils/attachmentUtils.js';
import { reformatMongooseError } from '../utils/errorUtils.js';

export const errorHandler = (err, req, res, next) => {
   const error = err instanceof mongoose.Error ? reformatMongooseError(err) : err;
   let { statusCode } = error;

   console.info(`
   <<-- ERROR -->>
   Endpoint: ${req.method} ${req.path}
   Name: ${error.name}
   Message: ${error.message}
   Path: ${error.path}
   Value: ${error.value}
   `);

   console.error(error);

   // this is for unhandled exceptions, check console for details
   if (!statusCode) {
      statusCode = 500;
      error.message = 'An unknown error has occured.'
   };

   return res.status(statusCode).json({ error });
};

process.on('uncaughtException', (error) => console.error('Unchaught Error:', error));
process.on('unhandledRejection', (rejection) => console.error('Unhandled Rejection:', rejection));