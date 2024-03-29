// model
import Job from '../models/job.js';

// utilities
import MyErrors from '../utils/errorUtils.js';
import { deleteAttachments, referenceUploadedFilesToAttachments } from '../utils/attachmentUtils.js';
import { referenceNewlyUploadedFilesToNoteAttachments } from '../utils/attachmentUtils.js';
import { applyFiltersToQuery } from '../utils/mongoDBQueryUtils.js';

const docFieldsToPopulate = [
   'billing.fee',
   'customer',
   'createdBy',
   'drivers',
   'status',
   'notes.createdBy',
];

const getJobs = async (req, res, next) => {
   const filters = req.query;

   console.log(filters);

   try {
      // build the query by applying filters, then return filtered results
      const jobs = await applyFiltersToQuery({
         filters,
         query: Job.find({})
      })
         .populate(docFieldsToPopulate)
         .sort({ createdAt: -1 })

      // for pagination
      req.body.results = jobs;

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

      req.job = job;

      next();
   }
   catch (error) { next(error) };
};

// create new job
const createJob = async (req, res, next) => {
   try {

      const newJob = JSON.parse(req.body.job);

      // only executes if there is a note
      referenceUploadedFilesToAttachments({
         attachments: newJob.notes[0]?.attachments || [],
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
   catch (error) {
      console.info('An error has occured, any uploaded files will be deleted.');
      deleteAttachments(req.files);
      next(error);
   };
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
   try {

      const { id } = req.params;
      const { driverNote, filesToDelete, notes } = req.body;

      if (notes) {
         referenceNewlyUploadedFilesToNoteAttachments({
            notes,
            files: req.files
         });
      };

      // a single note from the driver only needs to have the note pushed since they can only add one note at a time
      if (driverNote) {
         req.body.$push = { notes: notes[0] };
         delete req.body.notes;
         delete req.body.driverNote;
      };

      const job = await Job.findByIdAndUpdate(
         { _id: id },
         { ...req.body },
         {
            returnDocument: 'after',
            runValidators: true
         }
      ).populate(docFieldsToPopulate);

      if (!job) MyErrors.jobNotFound({ id });

      // once the document has been updated, delete the old attachments of the notes that were removed
      if (filesToDelete) deleteAttachments(filesToDelete);

      return res.status(200).json(job);
   }
   catch (error) {
      console.info('An error has occured, any uploaded files will be deleted.');
      deleteAttachments(req.files);
      next(error);
   };
};

export { createJob, getJob, getJobs, deleteJob, updateJob };