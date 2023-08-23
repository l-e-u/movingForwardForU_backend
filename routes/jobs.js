import { Router } from 'express';

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

// GET all jobs
router.get('/', getJobs, paginate);

// GET a single job
router.get('/:id', getJob);

// POST a new job
router.post('/', uploadAttachments, createJob);

// DELETE a job
router.delete('/:id', deleteJob);

// UPDATE a job
router.patch('/:id', uploadAttachments, updateJob);

export default router;