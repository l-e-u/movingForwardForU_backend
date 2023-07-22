// utilities
import MyErrors from '../utils/errorUtils.js';
import util from 'util';

import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const maxNumberOfFilesToUpload = 10;

const storage = new GridFsStorage({
   url: process.env.MONGO_URI,
   options: { useNewUrlParser: true, useUnifiedTopology: true },
   file: (req, file) => {
      const match = ['image/jpeg', 'image/jpg', 'image/png'];

      // html file input accepted files are set the same, this is a second safety net
      if (match.indexOf(file.mimetype) === -1) {
         throw { message: 'File type not accepted.' };
      };

      return {
         bucketName: 'attachments',
         filename: `${Date.now()}--movingForward-${file.originalname}`,
      };
   },
});

const uploadFiles = multer({ storage: storage }).array('attachments', maxNumberOfFilesToUpload);
const uploadFilesPromise = util.promisify(uploadFiles);

const uploadAttachments = async (req, res, next) => {

   try {
      await uploadFilesPromise(req, res);

      console.log('Uploaded Files:');
      console.log(req.files);

      next();
   }
   catch (error) {
      if (error.code === 'LIMIT_UNEXPECTED_FILE') next(MyErrors.uploadAttachmentsLimitReached());

      next(MyErrors.uploadAttachment());
   };
};

export { uploadAttachments };