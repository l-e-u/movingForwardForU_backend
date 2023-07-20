import mongoose from 'mongoose';

// model
import Job from '../models/job.js';

// utilities
import MyErrors from '../utils/errorUtils.js';
import { deleteAttachments } from '../utils/attachmentUtils.js';
import { applyFiltersToQuery } from '../utils/mongooseUtils.js';

const docFieldsToPopulate = [
   'billing.fee',
   'customer',
   'createdBy',
   'drivers',
   'status',
   'notes.createdBy',
];

// get all jobs
const getJobs = async (req, res, next) => {
   let { page, limit, ...filters } = req.query;
   page = parseInt(page || 0);
   limit = parseInt(limit || 0);

   let startIndex = (page - 1) * limit;
   let endIndex = page * limit;
   let totalPages = 0;

   try {
      // build the query by applying filters, then return filtered results
      const jobs = await applyFiltersToQuery({
         filters,
         query: Job.find({})
      })
         .populate(docFieldsToPopulate)
         .sort({ createdAt: -1 });

      const count = jobs.length;
      totalPages = Math.floor(count / limit);

      if (count > limit) totalPages += (count % limit) === 0 ? 0 : 1;

      // set boundaries for safety
      if (!limit || limit === 0 || limit > count || startIndex > count) {
         startIndex = 0;
         endIndex = jobs.length;
         totalPages = 1;
      };

      console.log('count:', count)
      console.log('page:', page)
      console.log('limit:', limit)
      console.log('start:', startIndex)
      console.log('end:', endIndex)

      const results = jobs.splice(startIndex, endIndex);

      console.log('total pages:', totalPages);


      return res.status(200).json({ count, results, totalPages });
   }
   catch (error) { next(error) };
};

// get a single job
const getJob = async (req, res, next) => {
   const { id } = req.params;

   try {
      const job = await Job.findById(id).populate(docFieldsToPopulate);
      if (!job) throw MyErrors.jobNotFound();

      res.status(200).json(job);
   }
   catch (error) { next(error) };
};

// create new job
const createJob = async (req, res, next) => {
   const { _id: user_id } = req.user;

   // from client
   const newJob = JSON.parse(req.body.job);

   // from middleware
   const files = req.files;

   try {
      // loop through each note and attachements to find the file corresponding to that attachment
      newJob.notes.forEach(({ attachments }) => {
         // for new jobs, if there's any attachments, then there's a new file
         attachments.forEach((attachment, index) => {
            const file = files.find(f => f.originalname === attachment.filename);
            const { contentType, filename, id, originalname, size } = file;
            attachments[index] = { contentType, filename, originalname, size, files_id: id };
         })
      });

      // add doc to db
      let job = await Job.create({
         ...newJob,
         createdBy: user_id
      });

      // populate fields
      job = await job.populate(docFieldsToPopulate);

      return res.status(200).json(job);
   }
   catch (err) {
      console.error(err);

      console.error('An error has occured, job creation has been aborted, and uploaded files will be deleted.');
      // 'errors' contains any mongoose model-validation fails, rename to error
      let { errors: error } = err;

      // if there's any files that were uploaded, delete them now
      if (req.files.length > 0) deleteAttachments(req.files);

      // go through the properties and seek out note errors, format them in an array
      for (const key in error) {
         const propStringArr = key.split('.');
         const propName = propStringArr[0];

         // having an error with the first note's subject, mongoose will return an error object with a key named 'note.0.subject'
         // cycle through the props, and with note errors, format them into an array so it'll be error.notes[index] = {subject;}
         if (propName === 'notes') {
            const index = propStringArr[1];

            // note schema has subject or message properties
            const noteProp = propStringArr[2];

            // this is the actual error message
            const message = error[key].message;

            // create the array if it doesn't exist
            if (!error.notes) error.notes = [];

            error.notes[index] = {
               ...error.notes[index],
               [noteProp]: message
            };

            // delete the old key
            delete error[key];
         };
      };

      // if no input errors, then send back the err message as a server error
      if (!error) {
         error = {};
         error.server = err || err.message;
      };

      return res.status(400).json({ error });
   };
};

// delete a job
const deleteJob = async (req, res, next) => {
   const { id } = req.params;

   try {
      const job = await Job.findByIdAndDelete(id);
      if (!job) throw MyErrors.jobNotFound();

      // after the job has been deleted loop through all notes and deleted all attachments
      job.notes.forEach(({ attachments }) => deleteAttachments(attachments.map(attachment => ({ id: attachment.files_id }))));

      res.status(200).json(job);
   }
   catch (error) { next(error) };
};

// update a job
const updateJob = async (req, res, next) => {
   const { id } = req.params;
   const error = { server: { message: 'No such job.' } };

   // from client
   const updates = JSON.parse(req.body.updates);
   const filesToDelete = JSON.parse(req.body.filesToDelete);

   // from middleware
   const files = req.files;


   if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error });
   };

   try {
      updates.notes?.forEach(({ attachments }) => {
         attachments.forEach((attachment, index) => {
            // check if there's any new files for attachments
            const file = files.find(f => f.originalname === attachment.filename);

            // if a new file is found, then set its info
            if (file) {
               const { contentType, filename, id, originalname, size } = file;
               attachments[index] = { contentType, filename, originalname, size, files_id: id };
            };
         });
      });

      // this applies only when adding a single new note from a driver
      if (updates.notes?.length > 0) {
         const note = updates.notes[0];

         if (!note._id) {
            updates.$push = { notes: updates.notes[0] };
            delete updates.notes;
         };
      };

      console.log('Updated fields:', updates);

      const job = await Job.findByIdAndUpdate(
         { _id: id },
         { ...updates },
         {
            returnDocument: 'after',
            runValidators: true
         }
      ).populate(docFieldsToPopulate);

      if (!job) {
         return res.status(404).json({ error });
      };

      // once the document has been updated, deleted the old attachments of the notes that were removed
      deleteAttachments(filesToDelete);

      return res.status(200).json(job);
   }
   catch (err) {
      console.error(err);

      console.error('An error has occured, job creation has been aborted, and uploaded files will be deleted.');

      // 'errors' contains any mongoose model-validation fails, rename to error
      let { errors: error } = err;

      // if there's any files that were uploaded, delete them now
      if (req.files.length > 0) deleteAttachments(req.files);

      // go through the properties and seek out note errors, format them in an array
      for (const key in error) {
         const propStringArr = key.split('.');
         const propName = propStringArr[0];

         // having an error with the first note's subject, mongoose will return an error object with a key named 'note.0.subject'
         // cycle through the props, and with note errors, format them into an array so it'll be error.notes[index] = {subject;}
         if (propName === 'notes') {
            const index = propStringArr[1];

            // note schema has subject or message properties
            const noteProp = propStringArr[2];

            // this is the actual error message
            const message = error[key].message;

            // create the array if it doesn't exist
            if (!error.notes) error.notes = [];

            error.notes[index] = {
               ...error.notes[index],
               [noteProp]: message
            };

            // delete the old key
            delete error[key];
         };
      };

      // if no input errors, then send back the err message as a server error
      if (!error) {
         error = {};
         error.server = err;
      };

      return res.status(400).json({ error });
   }
};

export { createJob, getJob, getJobs, deleteJob, updateJob };