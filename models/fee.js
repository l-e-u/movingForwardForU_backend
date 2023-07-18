import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const feeSchema = new Schema(
   {
      amount: {
         required: [true, 'Amount is required.'],
         validate: {
            validator: function (v) {
               return /^[-+]?\d+(\.\d{1,2})?$/.test(v)
            },
            message: 'Amount is not valid.'
         },
         type: Number,
      },
      createdBy: {
         ref: 'User',
         required: [true, 'Creator ID is required.'],
         type: Schema.Types.ObjectId,
      },
      description: {
         required: [true, 'Description is required.'],
         trim: true,
         type: String,
      },
      name: {
         required: [true, 'Name is required.'],
         trim: true,
         type: String,
         unique: true,
      },
   },
   { timestamps: true }
);

feeSchema.plugin(uniqueValidator);

export default Model('Fee', feeSchema);