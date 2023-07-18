import Status from '../models/status.js';

// utilities
import MyErrors from '../utils/errorUtils.js';

// GET all statuses
const getStatuses = async (req, res, next) => {
   try {
      const statuses = await Status.find({}).populate('createdBy').sort({ name: 1 });

      return res.status(200).json(statuses);
   }
   catch (error) { next(error) }
};

// GET one status
const getStatus = async (req, res, next) => {
   const { id } = req.params;

   try {
      const status = await Status.findById(id).populate('createdBy');
      if (!status) throw MyErrors.statusNotFound({ id });

      return res.status(200).json(status);
   }
   catch (error) { next(error) }
};

// create a new status
const createStatus = async (req, res, next) => {
   try {
      let status = await Status.create({
         ...req.body,
         createdBy: req.user._id
      });

      // populate field
      status = await status.populate('createdBy');

      return res.status(200).json(status);
   }
   catch (error) { next(error) };
};

// delete a status
const deleteStatus = async (req, res, next) => {
   const { id } = req.params;

   try {
      const status = await Status.findByIdAndDelete({ _id: id });
      if (!status) throw MyErrors.statusNotFound({ id });

      res.status(200).json(status);
   }
   catch (error) { next(error) }
};

// update a status
const updateStatus = async (req, res, next) => {
   const { id } = req.params;

   try {
      const status = await Status.findByIdAndUpdate(
         { _id: id },
         { ...req.body },
         {
            returnDocument: 'after',
            runValidators: true
         }
      ).populate('createdBy');

      if (!status) throw MyErrors.statusNotFound({ id });

      res.status(200).json(status);
   }
   catch (error) { next(error) };
};

export {
   createStatus,
   deleteStatus,
   getStatus,
   getStatuses,
   updateStatus
};