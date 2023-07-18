import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const contactSchema = new Schema(
   {
      address: {
         type: String,
         trim: true,
         required: [true, 'Address is required.']
      },
      billingAddress: {
         type: String,
         trim: true,
         set: i => !i ? null : i
      },
      createdBy: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'Creator ID is required.']
      },
      defaultFees: [{
         ref: 'Fee',
         type: Schema.Types.ObjectId,
      }],
      email: {
         type: String,
         lowercase: true,
         trim: true,
         set: i => !i ? null : i,
         match: [/\S+@\S+\.\S+/, 'Email is invalid.'],
      },
      misc: {
         type: String,
         trim: true,
         set: i => !i ? null : i
      },
      name: {
         type: String,
         trim: true,
         set: i => !i ? null : i
      },
      organization: {
         type: String,
         required: [true, 'Organization is required.'],
         trim: true,
         unique: true
      },
      phoneNumber: {
         type: String,
         trim: true,
         set: i => !i ? null : i.match(/\d/g).join(''),
         match: [/^\d{10}$/, 'Phone needs 9 digits.']
      },
      phoneExt: {
         type: String,
         trim: true,
      },
   },
   { timestamps: true }
);

contactSchema.plugin(uniqueValidator);

export default Model('Contact', contactSchema);;