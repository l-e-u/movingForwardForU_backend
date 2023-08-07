import { Schema, model as Model } from 'mongoose';

const transportSchema = new Schema({
   date: {
      default: Date.now,
      type: Date,
   },
   address: {
      required: [true, 'Address is required.'],
      trim: true,
      type: String,
   },
   includeTime: {
      default: false,
      type: Boolean,
   }
});

const noteSchema = new Schema(
   {
      attachments: {
         default: [],
         type: Array,
      },
      createdAt: {
         type: Date,
         default: Date.now,
         required: true
      },
      createdBy: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true
      },
      message: {
         type: String,
         trim: true,
         required: [true, 'Message is required.'],
      },
      updatedAt: {
         type: Date,
         default: Date.now,
         required: true
      },
   },
   { timestamps: false }
);

const jobSchema = new Schema(
   {
      delivery: transportSchema,
      mileage: Number,
      notes: [noteSchema],
      pickup: transportSchema,
      billing: [{
         fee: {
            ref: 'Fee',
            type: Schema.Types.ObjectId,
         },
         adjustedAmount: {
            default: null,
            type: Number
         }
      }],
      createdBy: {
         ref: 'User',
         required: true,
         type: Schema.Types.ObjectId,
      },
      customer: {
         ref: 'Contact',
         required: [true, 'Customer is required.'],
         type: Schema.Types.ObjectId,
      },
      drivers: [{
         ref: 'User',
         type: Schema.Types.ObjectId,
      }],
      parcel: {
         set: i => !i ? null : i,
         trim: true,
         type: String,
      },
      reference: {
         set: i => !i ? null : i,
         trim: true,
         type: String,
      },
      status: {
         ref: 'Status',
         required: [true, 'Status is required.'],
         type: Schema.Types.ObjectId,
      },
   },
   {
      timestamps: true,
   }
);

export default Model('Job', jobSchema);;