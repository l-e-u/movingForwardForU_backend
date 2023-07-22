import mongoose from 'mongoose';

// accepts an array of notes and an array of files
export const referenceNewlyUploadedFilesToNoteAttachments = ({ notes, files }) => {
   notes.forEach((note, noteIndex) => {
       // each note contains an array of attachments
      note.attachments.forEach((attachment, attachmentIndex) => {
          // an attachment with a newly uploaded file while have an empty object named 'file'
         if (attachment.file) {
             // find the uploaded file that belongs to this attachment
            const { id, ...uploadedFileDetails } = files.find(file => attachment.filename === file.originalname);

// save the uploaded file details to this note's attachment's, renaming only id to _id
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