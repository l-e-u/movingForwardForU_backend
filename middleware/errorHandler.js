import mongoose from 'mongoose';

// utilities
import { deleteAttachments } from '../utils/attachmentUtils.js';
import { reformatMongooseError } from '../utils/errorUtils.js';

export const errorHandler = (err, req, res, next) => {
   const error = err instanceof mongoose.Error ? reformatMongooseError(err) : err;
   const hasUploadedFiles = req.files?.length > 0;
   let { statusCode } = error;


   console.info(`
   <<-- ERROR -->>
   Endpoint: ${req.method} ${req.path}
   Name: ${error.name}
   Message: ${error.message}
   Path: ${error.path}
   Value: ${error.value}
   `);

   if (hasUploadedFiles) {
      console.info('An error has occured, any uploaded files will be deleted.');
      deleteAttachments(req.files);
   };

   console.error(error);

   // this is for unhandled exceptions, check console for details
   if (!statusCode) {
      statusCode = 500;
      error.message = 'An unknown error has occured.'
   };

   return res.status(statusCode).json({ error });
};