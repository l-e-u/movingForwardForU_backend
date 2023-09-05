import { Router, response } from 'express';

import {
   createJob,
   getJob,
   getJobs,
   deleteJob,
   updateJob,
} from '../controllers/jobController.js'

// middleware
import { requireAuth } from '../middleware/requireAuth.js';
import { uploadAttachments } from '../middleware/uploadAttachments.js';
import { paginate } from '../middleware/paginate.js';

// debugging seeding
// import User from '../models/user.js';
// import Contact from '../models/contact.js';
// import Fee from '../models/fee.js';
// import Status from '../models/status.js';
// import Job from '../models/job.js';

// import dummyJobs from '../data/jobs.json' assert {type: 'json'};

// const getRandomItem = (array, max) => {
//    return array[Math.floor(Math.random() * max)];
// };

const router = Router();

// router.get('/seed', async (req, res, next) => {

// const fees = await Fee.find({}, { _id: 1 });
// const contacts = await Contact.find({}, { _id: 1, address: 1 });
// const statuses = await Status.find({}, { _id: 1 });
// const users = await User.find({}, { _id: 1 });
// const elihuID = await User.findOne({ firstName: 'Elihu' }, { _id: 1 });

// const newJobs = dummyJobs.map(job => {
//    const contact = getRandomItem(contacts, contacts.length);
//    const statusID = getRandomItem(statuses, statuses.length)._id;

//    return ({
//       ...job,
//       customer: contact._id,
//       status: statusID,
//       delivery: {
//          ...job.delivery,
//          address: getRandomItem(contacts, contacts.length).address
//       },
//       pickup: {
//          ...job.pickup,
//          address: contact.address
//       },
//       drivers: job.drivers.map(driver => getRandomItem(users, users.length)._id),
//       billing: job.billing.map(bill => ({ ...bill, fee: getRandomItem(fees, fees.length)._id })),
//       notes: job.notes?.map(note => ({ ...note, createdBy: getRandomItem(users, users.length)._id })) ?? [],
//       createdBy: elihuID._id
//    })
// });

// await Job.insertMany(newJobs);

//    res.status(200).json(jobs.splice(0, 10));
// });

// authenticates user is valid and logged in to access further end points
router.use(requireAuth);

// GET jobs that are note archived
router.get('/', (req, res, next) => {
   req.query.isArchived = false;

   next();
}, getJobs, paginate);

// GET jobs assinged to logged in user
router.get('/driver', (req, res, next) => {
   req.query.drivers = req.user._id.toString();
   req.query.isArchived = false;

   next();
}, getJobs, paginate);

// GET archived jobs only
router.get('/archived', (req, res, next) => {
   req.query.isArchived = true;

   next();
}, getJobs, paginate);

// POST a new job
router.post('/', uploadAttachments, createJob);

// DELETE a job
router.delete('/:id', deleteJob);

// ARCHIVE a job
router.patch('/archive/:id', getJob,
   async (req, res, next) => {
      // set archive fields in the same format as a job
      try {
         const { job } = req;

         job.archive = {
            billing: job.billing.map(bill => ({
               fee: {
                  amount: bill.fee.amount,
                  name: bill.fee.name
               },
               overrideAmount: bill.overrideAmount
            })),
            createdBy: `${job.createdBy.firstName} ${job.createdBy.lastName}`,
            customer: job.customer.organization,
            date: new Date(),
            drivers: job.drivers.map(driver => `${driver.firstName} ${driver.lastName}`),
            status: job.status.name
         };

         job.isArchived = true;

         job.notes.forEach(async (note) => {
            note.archive = {
               createdBy: `${note.createdBy.firstName} ${note.createdBy.lastName}`
            };

            // warning appears in console saying subdoc.save() does not save parent document
            await note.save({ suppressWarning: true });
         });

         // subdoc warning is suppressed because the parent doc runs save
         await job.save();

         return res.status(200).json(job);

      } catch (error) {
         next(error);
      };
   }
);

// UPDATE a job
router.patch('/:id',
   uploadAttachments,
   (req, res, next) => {
      const { filesToDelete, updates } = req.body;

      if (updates) {
         req.body = {
            ...req.body,
            ...JSON.parse(updates),
         };

         delete req.body.updates;
      };

      if (filesToDelete) req.body.filesToDelete = JSON.parse(filesToDelete);

      next();
   },
   updateJob
);

export default router;