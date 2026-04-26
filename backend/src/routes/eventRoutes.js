import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent, getEventById } from '../controllers/eventController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', adminMiddleware, createEvent);
router.put('/:id', adminMiddleware, updateEvent);
router.delete('/:id', adminMiddleware, deleteEvent);

export default router;
