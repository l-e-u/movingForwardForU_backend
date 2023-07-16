import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const statusSchema = new Schema(
   {
      name: {
         match: /^[A-Za-z0-9 ]*$/,
         required: true,
         trim: true,
         type: String,
         unique: true,
      },
      description: {
         required: true,
         trim: true,
         type: String,
      },
      createdBy: {
         ref: 'User',
         require: true,
         type: Schema.Types.ObjectId,
      },
      isDefault: {
         default: false,
         type: Boolean,
      },
   },
   { timestamps: true }
);

statusSchema.plugin(uniqueValidator, { message: 'Is already in use.' });

export default Model('Status', statusSchema);