import mongoose from 'mongoose';

export const referenceNewlyUploadedFilesToNoteAttachments = ({ notes, files }) => {
   notes.forEach((note, noteIndex) => {
      note.attachments.forEach((attachment, attachmentIndex) => {
         if (attachment.file) {
            const { id, ...uploadedFileDetails } = files.find(file => attachment.filename === file.originalname);

            notes[noteIndex].attachments[attachmentIndex] = {
               ...uploadedFileDetails,
               _id: id
            }
         }
      })
   });
};

export const deleteAttachments = async (files) => {
   let gfs;
   const conn = new mongoose.createConnection(process.env.MONGO_URI);

   conn.once('open', () => {
      gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'attachments' });

      // id is used when the files have been uploaded, but the job creation/update has failed
      // _id is used when a job note's attachment is being deleted
      files.forEach(file => {
         const { id, _id } = file;
         const fileObjectID = new mongoose.Types.ObjectId(id || _id);

         // this will delete the file and its chunks from mongodb attachments.files & attachments.chunks
         gfs.delete(fileObjectID);
         console.log('File deleted:');
         console.log(file);
      });
   });
};