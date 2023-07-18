import mongoose from 'mongoose';
import Fee from '../models/fee.js';

import {
   DocumentNotFoundError,
   EmptyStringError,
   InvalidMongoDBObjectID,
   NaNError,
} from '../utils/errorHandlingUtils.js';

import throwError from '../utils/errorHandlingUtils.js';
import { objectIDisInvalid, isUniqueValidationError } from '../utils/mongooseUtils.js';

// GET all fees
const getFees = async (req, res, next) => {
   try {
      const fees = await Fee.find({}).populate('createdBy').sort({ name: 1 });

      return res.status(200).json(fees);
   } catch (error) { next(error) };
};

// GET one fee
const getFee = async (req, res, next) => {
   try {
      const { id } = req.params;

      if (objectIDisInvalid(id)) throwError.objectIDisInvalid({ value: id });

      const fee = await Fee.findById(id).populate('createdBy');

      if (!fee) throwError.feeNotFound({ id });

      return res.status(200).json(fee);
   }
   catch (error) { next(error) };
};

// POST create a new fee
const createFee = async (req, res, next) => {
   const { _id: user_id } = req.user;
   const { amount, description, name } = req.body;

   try {
      if (!amount || isNaN(amount)) throwError.isNaN({ path: 'Amount', value: amount });
      if (!description.trim()) throwError.emptyString({ path: 'Description', value: description });
      if (!name.trim()) throwError.emptyString({ path: 'Description', value: name });

      const fee = await Fee.create({ ...req.body, createdBy: user_id });
      await fee.populate('createdBy');

      return res.status(200).json(fee);
   } catch (error) {
      if (isUniqueValidationError(error)) throwError.uniqueValueError(error);

      next(error)
   };
};

// DELETE one fee
const deleteFee = async (req, res, next) => {
   const { id } = req.params;

   try {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new InvalidMongoDBObjectID();

      const fee = await Fee.findByIdAndDelete({ _id: id });
      if (!fee) throw new DocumentNotFoundError('Fee');

      res.status(200).json(fee);
   } catch (error) { next(error) };
};

// PATCH update one fee
const updateFee = async (req, res, next) => {
   const { id } = req.params;

   try {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new InvalidMongoDBObjectID();

      const fee = await Fee.findByIdAndUpdate(
         { _id: id },
         { ...req.body },
         {
            returnDocument: 'after',
            runValidators: true
         }
      ).populate('createdBy');

      if (!fee) throw new DocumentNotFoundError('Fee');

      return res.status(200).json(fee);
   } catch (error) {
      const { errors } = error;

      if (errors) {
         const key = Object.keys(errors)[0];

         if (errors[key].kind === 'unique') {
            next(
               new IsUniqueError({
                  mongoDBValidationError: {
                     ...errors[key],
                     message: errors._message
                  }
               })
            );
         };
      };

      next(error);
   };
};

export {
   createFee,
   deleteFee,
   getFee,
   getFees,
   updateFee
};