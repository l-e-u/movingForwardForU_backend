import { Router } from 'express';

// middleware
import { requireAuth } from '../middleware/requireAuth.js';

// controllers
import { createFee, deleteFee, getFee, getFees, updateFee } from '../controllers/feeController.js';

const router = Router();

// authenticates user is valid and logged in to access further end points
router.use(requireAuth);

// GET all fess
router.get('/', getFees);

// GET a single fee
router.get('/:id', getFee);

// POST a new fee
router.post('/', createFee);

// DELETE a fee
router.delete('/:id', deleteFee);

// UPDATE a fee
router.patch('/:id', updateFee);

export default router;