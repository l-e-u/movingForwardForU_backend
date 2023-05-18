import { Router } from "express";
import { requireAuth } from '../middleware/requireAuth.js';

// controller functions
import {
    deleteUser,
    getUser,
    getUsers,
    loginUser,
    registerUser,
    sendEmailResetPasswordLink,
    updateUser,
    verifyEmailToken,
    verifyUser,
} from "../controllers/userController.js";

const router = Router();

// login route
router.post('/login', loginUser);

router.post('/resetPassword', sendEmailResetPasswordLink);

// verify email token to ensure the token is valid
router.post('/verify/:emailToken/:resetPassword', verifyEmailToken);

// verify route
router.patch('/verify', verifyUser);

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
router.patch('/:id', updateUser)

export default router;