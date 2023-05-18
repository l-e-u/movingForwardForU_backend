import mongoose from 'mongoose';
import { deleteAttachments } from './attachmentController.js';

// models
import Archive from '../models/archive.js';
import Job from '../models/job.js';

// get all archives
const getArchives = async (req, res) => {
    let { page, limit, ...filters } = req.query;

    page = parseInt(page || 0);
    limit = parseInt(limit || 0);

    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let totalPages = 0;

    // format the filters for mongodb
    if (filters.organization) {
        filters.organization = { $regex: filters.organization };
    };

    if (filters.drivers) {
        const text = filters.drivers;
        filters.drivers = { $elemMatch: { $or: [{ name: { $regex: text, $options: 'i' } }, { email: { $regex: text, $options: 'i' } }] } };
    };

    if (filters.reference) {
        filters.reference = { $regex: filters.reference, $options: 'i' };
    };

    if (filters.mileageGTE) {
        filters.mileage = { $gte: filters.mileageGTE };
        delete filters.mileageGTE;
    };

    if (filters.mileageLTE) {
        filters.mileage = { ...filters.mileage, $lte: filters.mileageLTE };
        delete filters.mileageLTE;
    };

    if (filters.createdOnGTE) {
        filters.createdAt = { $gte: filters.createdOnGTE };
        delete filters.createdOnGTE;
    };

    if (filters.createdOnLTE) {
        filters.createdAt = { ...filters.createdAt, $lte: filters.createdOnLTE };
        delete filters.createdOnLTE;
    };

    if (filters.pickupOnGTE) {
        filters['pickup.date'] = { $gte: filters.pickupOnGTE };
        delete filters.pickupOnGTE;
    };

    if (filters.pickupOnLTE) {
        filters['pickup.date'] = { ...filters['pickup.date'], $lte: filters.pickupOnLTE };
        delete filters.pickupOnLTE;
    };

    if (filters.deliveryOnGTE) {
        filters['delivery.date'] = { $gte: filters.deliveryOnGTE };
        delete filters.deliveryOnGTE;
    };

    if (filters.deliveryOnLTE) {
        filters['delivery.date'] = { ...filters['delivery.date'], $lte: filters.deliveryOnLTE };
        delete filters.deliveryOnLTE;
    };

    if (filters.notes) {
        const text = filters.notes;
        filters.notes = { $elemMatch: { $or: [{ subject: { $regex: text, $options: 'i' } }, { message: { $regex: text, $options: 'i' } }] } };
    };

    console.log('filters:', filters);

    const archives = await Archive.find(filters).populate('amendments.createdBy');
    const count = archives.length;
    totalPages = Math.floor(count / limit);

    if (count > limit) totalPages += (count % limit) === 0 ? 0 : 1;

    // set boundaries for safety
    if (!limit || limit === 0 || limit > count || startIndex > count) {
        startIndex = 0;
        endIndex = archives.length;
        totalPages = 1;
    };

    const results = archives.splice(startIndex, endIndex);

    return res.status(200).json({ count, results, totalPages });
}

// create a new archive
const createArchive = async (req, res) => {
    const { receipt, job_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(job_id)) {
        return res.status(404).json({ error: { message: 'No such job.' } });
    };

    try {
        const archive = await Archive.create({ ...receipt });

        if (!archive) {
            return res.status(404).json({ message: 'No such archive.' });
        };

        const job = await Job.findByIdAndDelete(job_id);

        if (!archive) {
            return res.status(404).json({ message: 'No such job.' });
        };

        console.log('Archived job:', job_id);

        res.status(200).json(job);

    } catch (err) {
        console.error(err);

        return res.status(400).json({ error: err });
    };
};

// delete an archive
const deleteArchive = async (req, res) => {
    const { id } = req.params;
    const error = { message: 'Cannot find archive.' };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const archive = await Archive.findByIdAndDelete(id);

    if (!archive) return res.status(404).json({ error });

    // after the arhive has been deleted loop through all notes and deleted all attachments
    archive.notes.forEach(({ attachments }) => deleteAttachments(attachments.map(attachment => ({ id: attachment.files_id }))));

    return res.status(200).json(archive);
};

// update an archive
const updateArchive = async (req, res) => {
    const { _id: user_id } = req.user;
    const { id } = req.params;
    const { text } = req.body;
    const error = { message: 'Cannot find archive.' };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const archive = await Archive.findByIdAndUpdate(
        { _id: id },
        { $push: { amendments: { text, createdBy: user_id } } },
        { returnDocument: 'after' }
    ).populate('amendments.createdBy');

    await archive.pop

    if (!archive) return res.status(404).json({ error });

    return res.status(200).json(archive);
};

export { createArchive, deleteArchive, getArchives, updateArchive };