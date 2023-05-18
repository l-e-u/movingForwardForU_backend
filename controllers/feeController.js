import mongoose from 'mongoose';
import Fee from '../models/fee.js';

// get all fees
const getFees = async (req, res) => {
    const fees = await Fee.find({}).populate('createdBy').sort({ name: 1 });

    return res.status(200).json(fees);
};

// get a fee
const getFee = async (req, res) => {
    const { id } = req.params;
    const error = { server: { message: 'No such fee.' } };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const fee = await Fee.findById(id).populate('createdBy');

    if (!fee) return res.status(400).json({ error });

    return res.status(200).json(fee);
};

// create a new fee
const createFee = async (req, res) => {
    // routes authenticates user and stores their _id
    const { _id: user_id } = req.user;

    // add doc to db
    try {
        let fee = await Fee.create({
            ...req.body,
            createdBy: user_id
        });

        // populate fields

        fee = await fee.populate('createdBy');

        return res.status(200).json(fee);
    }
    catch (err) {
        console.error(err);

        // mongoose throws object named 'errors', rename it
        const error = err.errors;

        // errors other than mongoose are sent over as 'error.server';
        if (!error) error = { server: { message: err.message } };

        return res.status(400).json({ error });
    };
};

// delete a fee
const deleteFee = async (req, res) => {
    const { id } = req.params;
    const error = { server: { message: 'No such fee.' } };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const fee = await Fee.findByIdAndDelete({ _id: id });

    if (!fee) {
        return res.status(404).json({ error });
    };

    res.status(200).json(fee);
};

const updateFee = async (req, res) => {
    const { id } = req.params;
    const error = { server: { message: 'No such fee.' } };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    // add doc to db
    try {
        const fee = await Fee.findByIdAndUpdate(
            { _id: id },
            { ...req.body },
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).populate('createdBy');

        if (!fee) return res.status(400).json({ error });

        return res.status(200).json(fee);
    }
    catch (err) {
        console.error(err);

        // mongoose throws object named 'errors', rename it
        const error = err.errors;

        // errors other than mongoose are sent over as 'error.server';
        if (!error) error = { server: { message: err.message } };

        return res.status(400).json({ error });
    };
};

export {
    createFee,
    deleteFee,
    getFee,
    getFees,
    updateFee
};