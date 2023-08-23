import { Router } from 'express';
import { createContact, getContact, getContacts, deleteContact, updateContact } from '../controllers/contactController.js'

// middleware
import { requireAuth } from '../middleware/requireAuth.js';
import { paginate } from '../middleware/paginate.js';

const router = Router()

// authenticates user is valid and logged in to access further end points
router.use(requireAuth);

// GET all contacts
router.get('/', getContacts, paginate);

// GET a single contact
router.get('/:id', getContact);

// POST a new contact
router.post('/', createContact);

// DELETE a contact
router.delete('/:id', deleteContact);

// UPDATE a contact
router.patch('/:id', updateContact);

export default router;