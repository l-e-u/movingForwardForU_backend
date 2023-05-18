import { Router } from 'express';

import {
    createArchive,
    deleteArchive,
    getArchives,
    updateArchive,
} from '../controllers/archiveController.js';

// middleware
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// authenticates user is valid and logged in to access further end points
router.use(requireAuth);

// GET archives
router.get('/', getArchives);

// POST archive
router.post('/', createArchive);

// DELETE archive
router.delete('/:id', deleteArchive);

// PATCH archive
router.patch('/:id', updateArchive);

export default router;