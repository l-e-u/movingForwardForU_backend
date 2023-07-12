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

const router = Router();

// authenticates user is valid and logged in to access further end points
router.use(requireAuth);

// GET jobs
router.get('/', getJobs);

// GET a single job
router.get('/:id', getJob);

// POST a new job
router.post('/', uploadAttachments, createJob);

// DELETE a job
router.delete('/:id', deleteJob);

// UPDATE a job
router.patch('/:id', uploadAttachments, updateJob);

export default router;