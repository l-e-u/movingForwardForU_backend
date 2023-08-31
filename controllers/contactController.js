// models
import Contact from '../models/contact.js';
import Job from '../models/job.js';

// utilities
import { applyFiltersToQuery } from '../utils/mongoDBQueryUtils.js';
import MyErrors from '../utils/errorUtils.js';

const subDocumentsToPopulate = [
   'createdBy',
   'defaultFees',
];

// get all contacts
const getContacts = async (req, res, next) => {
   try {
      const filters = req.query;
      console.log(filters)

      const contacts = await applyFiltersToQuery({
         filters,
         query: Contact.find({})
      })
         .populate(subDocumentsToPopulate)
         .sort({ organization: 1 });

      // for pagination
      req.body.results = contacts;

      next();
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

// delete a contact
const deleteContact = async (req, res, next) => {
   const { id } = req.params;

   try {
      // before a contact can be deleted, ensure that there aren't any jobs using this contact
      const job = await Job.findOne({ customer: id });
      if (job) throw MyErrors.contactCannotBeDeleted({ id });

      const contact = await Contact.findByIdAndDelete({ _id: id });
      if (!contact) throw MyErrors.contactNotFound({ id });

      res.status(200).json(contact);
   }
   catch (error) { next(error) };
};

// update a contact
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