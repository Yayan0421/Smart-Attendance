import express from 'express';
import { scanAttendance, getAttendanceLogs, getAttendanceByEvent, getDashboardStats, receivePendingRFID, getPendingRFID, clearPendingRFID } from '../controllers/attendanceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// RFID Registration endpoints (no auth required for receiving from hardware)
router.post('/register-rfid', receivePendingRFID);
router.get('/pending-rfid', getPendingRFID);
router.delete('/pending-rfid', clearPendingRFID);

// Attendance scanning and logging (auth required)
router.post('/scan', authMiddleware, scanAttendance);
router.get('/logs', authMiddleware, getAttendanceLogs);
router.get('/stats', authMiddleware, getDashboardStats);
router.get('/event/:event_id', authMiddleware, getAttendanceByEvent);

export default router;
