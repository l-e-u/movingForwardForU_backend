import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const statusSchema = new Schema(
   {
      name: {
         match: [/^[A-Za-z0-9 ]*$/, 'Name contains letters, numbers, and spaces only.'],
         required: [true, 'Name is required.'],
         trim: true,
         type: String,
         unique: true,
      },
      description: {
         required: [true, 'Description is required.'],
         trim: true,
         type: String,
      },
      createdBy: {
         ref: 'User',
         require: [true, 'Creator ID is required.'],
         type: Schema.Types.ObjectId,
      },
      isDefault: {
         default: false,
         type: Boolean,
      },
   },
   { timestamps: true }
);

statusSchema.plugin(uniqueValidator);

export default Model('Status', statusSchema);