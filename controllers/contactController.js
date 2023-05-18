import mongoose from "mongoose";
import Contact from '../models/contact.js';

const subDocumentsToPopulate = [
    'createdBy',
    'defaultFees',
];

// get all contacts
const getContacts = async (req, res) => {
    const contacts = await Contact.find({}).populate(subDocumentsToPopulate).sort({ organization: 1 });

    return res.status(200).json(contacts);
}

// get a single contact
const getContact = async (req, res) => {
    const { id } = req.params;
    const error = { server: { message: 'No such contact.' } };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const contact = await Contact.findById(id).populate(subDocumentsToPopulate);

    if (!contact) {
        return res.status(404).json({ error });
    };

    res.status(200).json(contact);
};

// create new contact
const createContact = async (req, res) => {
    // user added to req after status route authenticates the user
    const { _id: user_id } = req.user;

    // add doc to db
    try {
        let contact = await Contact.create({
            ...req.body,
            createdBy: user_id
        });

        // populate field
        contact = await contact.populate(subDocumentsToPopulate);

        return res.status(200).json(contact);
    }
    catch (err) {
        console.error(err);

        // 'errors' contains any mongoose model-validation fails
        const error = err.errors;

        // if no input errors, then send back the err message as a server error
        if (!error) error = { server: { message: err.message } };

        return res.status(400).json({ error });
    };
};

// delete a workout
const deleteContact = async (req, res) => {
    const { id } = req.params;
    const error = { server: { message: 'No such contact.' } };


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const contact = await Contact.findByIdAndDelete({ _id: id });

    if (!contact) {
        return res.status(404).json({ error });
    };

    res.status(200).json(contact);
};

// update a workout
const updateContact = async (req, res) => {
    const { id } = req.params;
    const error = { server: { message: 'No such contact.' } };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    try {
        const contact = await Contact.findByIdAndUpdate(
            { _id: id },
            { ...req.body },
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).populate(subDocumentsToPopulate);


        if (!contact) {
            return res.status(404).json({ error });
        };

        return res.status(200).json(contact);
    }
    catch (err) {
        console.error(err);

        // 'errors' contains any mongoose model-validation fails
        const error = err.errors;

        // if no input errors, then send back the err message as a server error
        if (!error) error = { server: { message: err.message } };

        return res.status(400).json({ error });
    };
};

export { createContact, getContact, getContacts, deleteContact, updateContact };