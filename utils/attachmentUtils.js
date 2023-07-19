import mongoose from 'mongoose';

export const deleteAttachments = async (files) => {
   let gfs;
   const conn = new mongoose.createConnection(process.env.MONGO_URI);

   conn.once('open', () => {
      gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'attachments' });

      files.forEach(file => {
         const { id } = file;
         const _id = new mongoose.Types.ObjectId(id);

         // this will delete the file and its chunks from mongodb attachments.files & attachments.chunks
         gfs.delete(_id);
         console.log(`File ${id} and chunks have been deleted.`);
      });
   });
};