import express from 'express';
import { scanAttendance, getAttendanceLogs, getAttendanceByEvent, getDashboardStats } from '../controllers/attendanceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/scan', authMiddleware, scanAttendance);
router.get('/logs', authMiddleware, getAttendanceLogs);
router.get('/stats', authMiddleware, getDashboardStats);
router.get('/event/:event_id', authMiddleware, getAttendanceByEvent);

export default router;
