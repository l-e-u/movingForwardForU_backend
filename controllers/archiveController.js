// models
import Archive from '../models/archive.js';
import Job from '../models/job.js';

// utilities
import { deleteAttachments } from '../utils/attachmentUtils.js';
import MyErrors from '../utils/errorUtils.js';

// get all archives
const getArchives = async (req, res, next) => {
   let { page, limit, ...filters } = req.query;

   page = parseInt(page || 0);
   limit = parseInt(limit || 0);

   let startIndex = (page - 1) * limit;
   let endIndex = page * limit;
   let totalPages = 0;

   // format the filters for mongodb
   if (filters.organization) {
      filters.organization = { $regex: filters.organization };
   };

   if (filters.drivers) {
      const text = filters.drivers;
      filters.drivers = { $elemMatch: { $or: [{ name: { $regex: text, $options: 'i' } }, { email: { $regex: text, $options: 'i' } }] } };
   };

   if (filters.reference) {
      filters.reference = { $regex: filters.reference, $options: 'i' };
   };

   if (filters.mileageGTE) {
      filters.mileage = { $gte: filters.mileageGTE };
      delete filters.mileageGTE;
   };

   if (filters.mileageLTE) {
      filters.mileage = { ...filters.mileage, $lte: filters.mileageLTE };
      delete filters.mileageLTE;
   };

   if (filters.createdOnGTE) {
      filters.createdAt = { $gte: filters.createdOnGTE };
      delete filters.createdOnGTE;
   };

   if (filters.createdOnLTE) {
      filters.createdAt = { ...filters.createdAt, $lte: filters.createdOnLTE };
      delete filters.createdOnLTE;
   };

   if (filters.pickupOnGTE) {
      filters['pickup.date'] = { $gte: filters.pickupOnGTE };
      delete filters.pickupOnGTE;
   };

   if (filters.pickupOnLTE) {
      filters['pickup.date'] = { ...filters['pickup.date'], $lte: filters.pickupOnLTE };
      delete filters.pickupOnLTE;
   };

   if (filters.deliveryOnGTE) {
      filters['delivery.date'] = { $gte: filters.deliveryOnGTE };
      delete filters.deliveryOnGTE;
   };

   if (filters.deliveryOnLTE) {
      filters['delivery.date'] = { ...filters['delivery.date'], $lte: filters.deliveryOnLTE };
      delete filters.deliveryOnLTE;
   };

   if (filters.notes) {
      const text = filters.notes;
      filters.notes = { $elemMatch: { $or: [{ subject: { $regex: text, $options: 'i' } }, { message: { $regex: text, $options: 'i' } }] } };
   };

   console.log('filters:', filters);

   try {

      const archives = await Archive.find(filters).populate('amendments.createdBy');
      const count = archives.length;
      totalPages = Math.floor(count / limit);

      if (count > limit) totalPages += (count % limit) === 0 ? 0 : 1;

      // set boundaries for safety
      if (!limit || limit === 0 || limit > count || startIndex > count) {
         startIndex = 0;
         endIndex = archives.length;
         totalPages = 1;
      };

      const results = archives.splice(startIndex, endIndex);

      return res.status(200).json({ count, results, totalPages });
   }
   catch (error) { next(error) };
};

// create a new archive
const createArchive = async (req, res, next) => {
   const { receipt, job_id } = req.body;

   try {
      await Archive.create({ ...receipt });
      const job = await Job.findByIdAndDelete(job_id);

      res.status(200).json(job);
   }
   catch (error) { next(error) };
};

// delete an archive
const deleteArchive = async (req, res, next) => {
   const { id } = req.params;

   try {
      const archive = await Archive.findByIdAndDelete({ _id: id });
      if (!archive) throw MyErrors.archiveNotFound({ id });

      // after the arhive has been deleted loop through all notes and deleted all attachments
      archive.notes.forEach(({ attachments }) => deleteAttachments(attachments.map(attachment => ({ id: attachment.files_id }))));

      return res.status(200).json(archive);
   }
   catch (error) { next(error) };
};

// update an archive
const updateArchive = async (req, res, next) => {
   const { _id: user_id } = req.user;
   const { id } = req.params;
   const { text } = req.body;

   try {
      const archive = await Archive.findByIdAndUpdate(
         { _id: id },
         { $push: { amendments: { text, createdBy: user_id } } },
         { returnDocument: 'after' }
      ).populate('amendments.createdBy');

      if (!archive) throw MyErrors.archiveNotFound({ id })

      return res.status(200).json(archive);
   }
   catch (error) { next(error) };
};

export { createArchive, deleteArchive, getArchives, updateArchive };