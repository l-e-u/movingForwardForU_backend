import mongoose from 'mongoose';
import Status from '../models/status.js';

import {
   DocumentNotFoundError,
   EmptyStringError,
   InvalidMongoDBObjectID,
   InvalidValueError,
} from '../utils/errorHandlingUtils.js';

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
      if (!mongoose.Types.ObjectId.isValid(id)) throw new InvalidMongoDBObjectID();

      const status = await Status.findById(id).populate('createdBy');

      if (!status) throw new DocumentNotFoundError('Status');

      return res.status(200).json(status);
   }
   catch (error) { next(error) }
};

// create a new status
const createStatus = async (req, res, next) => {
   const { _id: user_id } = req.user;
   const { name, description, isDefault } = req.body;
   const lettersNumbersSpacesOnly = /^[A-Za-z0-9 ]*$/;

   // add doc to db
   try {
      if (!name.trim() || !description.trim()) throw new EmptyStringError(!name.trim() ? 'Name' : 'Description');
      if (!lettersNumbersSpacesOnly.test(name)) {
         throw new InvalidValueError({
            property: 'name',
            message: 'Letters, numbers, and spaces only.'
         });
      };

      let status = await Status.create({ ...req.body, createdBy: user_id });

      // populate field
      status = await status.populate('createdBy');

      return res.status(200).json(status);
   }
   catch (error) { next(error) };
};

// delete a status
const deleteStatus = async (req, res, next) => {
   const { id: _id } = req.params;

   try {
      if (!mongoose.Types.ObjectId.isValid(_id)) throw new InvalidMongoDBObjectID();

      const status = await Status.findByIdAndDelete({ _id });

      if (!status) DocumentNotFoundError('Status');

      res.status(200).json(status);
   }
   catch (error) { next(error) }
};

// update a status
const updateStatus = async (req, res, next) => {
   const { id: _id } = req.params;

   try {
      if (!mongoose.Types.ObjectId.isValid(_id)) throw new InvalidMongoDBObjectID();

      const status = await Status.findByIdAndUpdate(
         { _id },
         { ...req.body },
         {
            returnDocument: 'after',
            runValidators: true
         }
      ).populate('createdBy');

      if (!status) DocumentNotFoundError('Status');

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