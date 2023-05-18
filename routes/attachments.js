import { Router } from 'express';

// controllers
import { getAttachment } from '../controllers/attachmentController.js';

// middleware
// import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// authenticates user is valid and logged in to access further end points
// router.use(requireAuth);

// downloads requested attachment
router.get('/download/:filename', getAttachment);

export default router;