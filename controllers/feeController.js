import Fee from '../models/fee.js';

// utilities
import MyErrors from '../utils/errorUtils.js';

// GET all fees
const getFees = async (req, res, next) => {
   try {
      const fees = await Fee.find({}).populate('createdBy').sort({ name: 1 });

      return res.status(200).json(fees);

   } catch (error) { next(error) };
};

// GET one fee
const getFee = async (req, res, next) => {
   const { id } = req.params;

   try {
      const fee = await Fee.findById(id).populate('createdBy');
      if (!fee) throw MyErrors.feeNotFound({ id });

      return res.status(200).json(fee);
   }
   catch (error) { next(error) };
};

// POST create a new fee
const createFee = async (req, res, next) => {
   try {
      const fee = await Fee.create({ ...req.body, createdBy: req.user._id });
      await fee.populate('createdBy');

      return res.status(200).json(fee);
   }
   catch (error) { next(error) };
};

// DELETE one fee
const deleteFee = async (req, res, next) => {
   const { id } = req.params;

   try {
      const fee = await Fee.findByIdAndDelete({ _id: id });
      if (!fee) throw MyErrors.feeNotFound({ id });

      res.status(200).json(fee);
   }
   catch (error) { next(error) };
};

// PATCH update one fee
const updateFee = async (req, res, next) => {
   const { id } = req.params;

   try {
      const fee = await Fee.findByIdAndUpdate(
         { _id: id },
         { ...req.body },
         {
            returnDocument: 'after',
            runValidators: true
         }
      ).populate('createdBy');

      if (!fee) throw MyErrors.feeNotFound({ id });

      return res.status(200).json(fee);
   }
   catch (error) { next(error) };
};

export {
   createFee,
   deleteFee,
   getFee,
   getFees,
   updateFee
};