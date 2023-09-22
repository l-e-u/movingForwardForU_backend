import { Router } from "express";

// controller functions
import {
   deleteUser,
   getUser,
   getUsers,
   loginUser,
   registerUser,
   sendEmailResetPasswordLink,
   setUserPassword,
   updateUser,
} from "../controllers/userController.js";

// middleware
import { decodeEmailToken } from '../middleware/decodeEmailToken.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// login route
router.post('/login', loginUser);

// send an email to user with link to reset password
router.post('/resetPassword', sendEmailResetPasswordLink);

router.post('/verify/:token', decodeEmailToken, updateUser);

router.patch('/setPassword', setUserPassword);

// authenticates user is valid and logged in to access further end points
router.use(requireAuth);

// GET all users
router.get('/', getUsers);

// GET a user
router.get('/:id', getUser);

// POST a new user
router.post('/', registerUser);

// DELETE a user
router.delete('/:id', deleteUser);

// UPDATE a user
router.patch('/:id', updateUser);

export default router;