import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const feeSchema = new Schema(
   {
      amount: {
         required: true,
         type: Number,
      },
      createdBy: {
         ref: 'User',
         required: true,
         type: Schema.Types.ObjectId,
      },
      description: {
         required: true,
         trim: true,
         type: String,
      },
      name: {
         required: true,
         trim: true,
         type: String,
         unique: true,
      },
   },
   { timestamps: true }
);

feeSchema.plugin(uniqueValidator, { message: 'Is already in use.' });

export default Model('Fee', feeSchema);