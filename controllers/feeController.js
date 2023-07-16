import mongoose from 'mongoose';
import Fee from '../models/fee.js';

import {
   DocumentNotFoundError,
   EmptyStringError,
   InvalidMongoDBObjectID,
   NaNError,
} from '../utils/errorHandlingUtils.js';

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

      if (!mongoose.Types.ObjectId.isValid(id)) throw new InvalidMongoDBObjectID();

      const fee = await Fee.findById(id).populate('createdBy');

      if (!fee) throw new DocumentNotFoundError('Fee');

      return res.status(200).json(fee);
   } catch (error) { next(error) };
};

// POST create a new fee
const createFee = async (req, res, next) => {
   const { _id: user_id } = req.user;
   const { amount, description, name } = req.body;

   try {
      if (!amount || isNaN(amount)) throw new NaNError('Amount');
      if (!description.trim() || !name.trim()) EmptyStringError(!description.trim() ? 'Description' : 'Name');

      const fee = await Fee.create({ ...req.body, createdBy: user_id });
      await fee.populate('createdBy');

      return res.status(200).json(fee);
   } catch (error) { next(error) };
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
   } catch (error) { next(error) };
};

export {
   createFee,
   deleteFee,
   getFee,
   getFees,
   updateFee
};