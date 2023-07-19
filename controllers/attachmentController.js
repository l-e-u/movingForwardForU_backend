import mongoose from 'mongoose';

// utilities
import MyErrors from '../utils/errorUtils.js';

// GET one attachment
const getAttachment = async (req, res, next) => {
   const { filename } = req.params;

   try {
      let gfs;
      const conn = new mongoose.createConnection(process.env.MONGO_URI);

      conn.once('open', () => {
         gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'attachments' });

         // const _id = new mongoose.Types.ObjectId(file_id);
         const downloadStream = gfs.openDownloadStreamByName(filename);

         downloadStream.on('data', function (data) {
            return res.status(200).write(data);
         });

         downloadStream.on('error', function (err) {
            console.error(err);
            throw new MyErrors.downloadAttachment();
         });

         downloadStream.on('end', () => {
            return res.end();
         });
      });
   }
   catch (error) { next(error) };
};

export { getAttachment };