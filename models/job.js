import { Schema, model as Model } from 'mongoose';

const transportSchema = new Schema({
    date: {
        default: Date.now,
        type: Date,
    },
    address: {
        index: true,
        required: [true, 'Cannot be empty.'],
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
            index: true,
        },
        subject: {
            type: String,
            trim: true,
            index: true,
            required: [true, 'Cannot be empty.']
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            required: true
        }
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
            required: [true, 'Make a selection.'],
            type: Schema.Types.ObjectId,
        },
        drivers: [{
            ref: 'User',
            type: Schema.Types.ObjectId,
        }],
        fees: [{
            ref: 'Fee',
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
            required: [true, 'Make a selection.'],
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

export default Model('Job', jobSchema);;