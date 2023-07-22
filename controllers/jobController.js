import mongoose from 'mongoose';

// model
import Job from '../models/job.js';

// utilities
import MyErrors from '../utils/errorUtils.js';
import { deleteAttachments } from '../utils/attachmentUtils.js';
import { referenceNewlyUploadedFilesToNoteAttachments } from '../utils/attachmentUtils.js';
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
// const getJobs = async (req, res, next) => {
//    let { page, limit, ...filters } = req.query;
//    page = parseInt(page || 0);
//    limit = parseInt(limit || 0);

//    let startIndex = (page - 1) * limit;
//    let endIndex = page * limit;
//    let totalPages = 0;

//    try {
//       // build the query by applying filters, then return filtered results
//       const jobs = await applyFiltersToQuery({
//          filters,
//          query: Job.find({})
//       })
//          .populate(docFieldsToPopulate)
//          .sort({ createdAt: -1 });

//       const count = jobs.length;
//       totalPages = Math.floor(count / limit);

//       if (count > limit) totalPages += (count % limit) === 0 ? 0 : 1;

//       // set boundaries for safety
//       if (!limit || limit === 0 || limit > count || startIndex > count) {
//          startIndex = 0;
//          endIndex = jobs.length;
//          totalPages = 1;
//       };

//       console.log('count:', count)
//       console.log('page:', page)
//       console.log('limit:', limit)
//       console.log('start:', startIndex)
//       console.log('end:', endIndex)

//       const results = jobs.splice(startIndex, endIndex);

//       console.log('total pages:', totalPages);

// req.body.list = jobs;

//       return res.status(200).json({ count, results, totalPages });
//    }
//    catch (error) { next(error) };
// };

const getJobs = async (req, res, next) => {
   const filters = req.query || {};

   try {
      // build the query by applying filters, then return filtered results
      const jobs = await applyFiltersToQuery({
         filters,
         query: Job.find({})
      })
         .populate(docFieldsToPopulate)
         .sort({ createdAt: -1 });

      req.body.list = jobs;

      next();
   }
   catch (error) { next(error) };
};

// get a single job
const getJob = async (req, res, next) => {
   const { id } = req.params;

   try {
      const job = await Job.findById(id).populate(docFieldsToPopulate);
      if (!job) throw MyErrors.jobNotFound({ id });

      res.status(200).json(job);
   }
   catch (error) { next(error) };
};

// create new job
const createJob = async (req, res, next) => {
   const newJob = JSON.parse(req.body.job);

   try {
      referenceNewlyUploadedFilesToNoteAttachments({
         notes: newJob.notes,
         files: req.files
      });

      let job = await Job.create({
         ...newJob,
         createdBy: req.user._id
      });

      // populate fields
      job = await job.populate(docFieldsToPopulate);

      return res.status(200).json(job);
   }
   catch (error) { next(error) };
};

// delete a job
const deleteJob = async (req, res, next) => {
   const { id } = req.params;

   try {
      const job = await Job.findByIdAndDelete(id);
      if (!job) throw MyErrors.jobNotFound();

      // after the job has been deleted loop through all notes and deleted all attachments
      job.notes.forEach(note => deleteAttachments(note.attachments));

      res.status(200).json(job);
   }
   catch (error) { next(error) };
};

// update a job
const updateJob = async (req, res, next) => {
   const { id } = req.params;
   const updates = JSON.parse(req.body.updates);
   const filesToDelete = JSON.parse(req.body.filesToDelete);
   const files = req.files;

   try {
      updates.notes?.forEach(({ attachments }) => {
         attachments.forEach((attachment, index) => {
            // check if there's any new files for attachments
            const file = files.find(f => f.originalname === attachment.filename);

            // if a new file is found, then set its info
            if (file) {
               const { contentType, filename, id, originalname, size } = file;
               attachments[index] = { contentType, filename, originalname, size, _id: id };
            };
         });
      });

      // a single note from the driver only needs to have the note pushed
      if (updates.driverNote) {
         updates.$push = { notes: updates.notes[0] };
         delete updates.notes;
         delete updates.driverNote;
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

      if (!job) MyErrors.jobNotFound({ id });

      // once the document has been updated, deleted the old attachments of the notes that were removed
      deleteAttachments(filesToDelete);

      return res.status(200).json(job);
   }
   catch (error) { next(error) };
};

export { createJob, getJob, getJobs, deleteJob, updateJob };