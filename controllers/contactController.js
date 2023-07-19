import Contact from '../models/contact.js';

// utilities
import MyErrors from '../utils/errorUtils.js';

const subDocumentsToPopulate = [
   'createdBy',
   'defaultFees',
];

// get all contacts
const getContacts = async (req, res, next) => {
   try {
      const contacts = await Contact.find({}).populate(subDocumentsToPopulate).sort({ organization: 1 });

      return res.status(200).json(contacts);
   }
   catch (error) { next(error) };
};

// get a single contact
const getContact = async (req, res, next) => {
   const { id } = req.params;

   try {
      const contact = await Contact.findById(id).populate(subDocumentsToPopulate);
      if (!contact) MyErrors.contactNotFound({ id });

      res.status(200).json(contact);
   }
   catch (error) { next(error) };
};

// create new contact
const createContact = async (req, res, next) => {
   try {
      let contact = await Contact.create({ ...req.body, createdBy: req.user._id });
      contact = await contact.populate(subDocumentsToPopulate);

      return res.status(200).json(contact);
   }
   catch (error) { next(error) };
};

// delete a workout
const deleteContact = async (req, res, next) => {
   const { id } = req.params;

   try {
      const contact = await Contact.findByIdAndDelete({ _id: id });
      if (!contact) throw MyErrors.contactNotFound({ id });

      res.status(200).json(contact);
   }
   catch (error) { next(error) };
};

// update a workout
const updateContact = async (req, res, next) => {
   const { id } = req.params;

   try {
      const contact = await Contact.findByIdAndUpdate(
         { _id: id },
         { ...req.body },
         {
            returnDocument: 'after',
            runValidators: true
         }
      ).populate(subDocumentsToPopulate);

      if (!contact) throw MyErrors.contactNotFound({ id });

      return res.status(200).json(contact);
   }
   catch (error) { next(error) };
};

export { createContact, getContact, getContacts, deleteContact, updateContact };