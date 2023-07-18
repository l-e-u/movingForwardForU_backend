import mongoose from 'mongoose';

export const objectIDisInvalid = (id) => !mongoose.Types.ObjectId.isValid(id);

export const isUniqueValidationError = (error) => {
   const { errors } = error;

   if (errors) {
      const key = Object.keys(errors)[0];

      return errors[key].kind === 'unique';
   };

   return false;
};