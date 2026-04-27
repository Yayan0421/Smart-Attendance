import { Op } from 'sequelize';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Event from '../models/Event.js';

// In-memory storage for pending RFID registrations
let pendingRFID = {
  uid: null,
  timestamp: null,
};

export const receivePendingRFID = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ 
        status: 'error',
        message: 'RFID UID required',
        name: 'Error',
        action: 'Invalid UID'
      });
    }

    // Find user by RFID UID
    const user = await User.findOne({ where: { rfid_uid: uid } });
    
    if (!user) {
      // UID not registered - store as pending registration
      pendingRFID = {
        uid,
        timestamp: Date.now(),
      };

      console.log(`Pending RFID received: ${uid}`);

      return res.status(404).json({
        status: 'pending',
        message: 'RFID not registered',
        name: 'Unknown User',
        action: 'Register in App',
        uid,
      });
    }

    // User found - try to record attendance at current active event
    const now = new Date();
    const activeEvent = await Event.findOne({
      where: {
        date: {
          [Op.lte]: now,
        },
      },
      order: [['date', 'DESC']],
    });

    if (!activeEvent) {
      return res.status(200).json({
        status: 'success',
        name: `${user.firstname} ${user.surname}`,
        action: 'No Active Event',
        message: 'User found but no active event',
      });
    }

    // Check for duplicate attendance in last 30 minutes
    const recentScan = await Attendance.findOne({
      where: {
        user_id: user.id,
        event_id: activeEvent.id,
      },
    });

    if (recentScan) {
      return res.status(200).json({
        status: 'duplicate',
        name: `${user.firstname} ${user.surname}`,
        action: 'Already Checked In',
        message: 'Duplicate scan detected',
      });
    }

    // Determine if user is on time or late
    const loginTime = new Date(activeEvent.date);
    const [hours, minutes] = activeEvent.login_time.split(':');
    loginTime.setHours(parseInt(hours), parseInt(minutes), 0);

    let status = 'Present';
    let action = 'Checked In';
    let fine = 0;

    if (now > loginTime) {
      status = 'Late';
      action = 'Late Check In';
      fine = activeEvent.fine_amount || 0;
    }

    // Record attendance
    const attendance = await Attendance.create({
      user_id: user.id,
      event_id: activeEvent.id,
      time_in: now,
      status,
      fine,
    });

    console.log(`Attendance recorded for ${user.firstname} ${user.surname}: ${status}`);

    res.status(201).json({
      status: 'success',
      name: `${user.firstname} ${user.surname}`,
      action: action,
      message: `${status} - Fine: $${fine}`,
      time: now.toLocaleTimeString(),
      eventName: activeEvent.name,
    });

  } catch (error) {
    console.error('Error in receivePendingRFID:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error processing RFID',
      name: 'System Error',
      action: 'Try Again',
      error: error.message 
    });
  }
};

export const getPendingRFID = async (req, res) => {
  try {
    // Check if pending RFID is still valid (within last 30 seconds)
    if (pendingRFID.uid && Date.now() - pendingRFID.timestamp < 30000) {
      res.status(200).json({
        uid: pendingRFID.uid,
        received: true,
      });
    } else {
      // Clear expired pending RFID
      pendingRFID = { uid: null, timestamp: null };
      res.status(200).json({
        uid: null,
        received: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending RFID', error: error.message });
  }
};

export const clearPendingRFID = async (req, res) => {
  try {
    pendingRFID = { uid: null, timestamp: null };
    res.status(200).json({ message: 'Pending RFID cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing pending RFID', error: error.message });
  }
};

export const scanAttendance = async (req, res) => {
  try {
    const { rfid_uid, event_id } = req.body;

    if (!rfid_uid || !event_id) {
      return res.status(400).json({ message: 'RFID UID and Event ID required' });
    }

    const user = await User.findOne({ where: { rfid_uid } });
    if (!user) {
      return res.status(404).json({ message: 'User with this RFID UID not found' });
    }

    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check for duplicate scans (within 5 minutes)
    const recentScan = await Attendance.findOne({
      where: {
        user_id: user.id,
        event_id: event_id,
      },
    });

    if (recentScan) {
      return res.status(400).json({ message: 'Duplicate scan detected' });
    }

    const now = new Date();
    const loginTime = new Date(event.date);
    const [hours, minutes] = event.login_time.split(':');
    loginTime.setHours(parseInt(hours), parseInt(minutes), 0);

    let status = 'Present';
    let fine = 0;

    if (now > loginTime) {
      status = 'Late';
      fine = event.fine_amount || 0;
    }

    const attendance = await Attendance.create({
      user_id: user.id,
      event_id: event_id,
      time_in: now,
      status,
      fine,
    });

    res.status(201).json({
      message: 'Attendance recorded',
      attendance: {
        student_name: `${user.firstname} ${user.surname}`,
        time_in: now,
        status,
        fine,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error scanning attendance', error: error.message });
  }
};

export const getAttendanceLogs = async (req, res) => {
  try {
    const { event_id, year_level, date } = req.query;

    let whereClause = {};
    if (event_id) whereClause.event_id = event_id;

    const logs = await Attendance.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'firstname', 'surname', 'student_number', 'year_level', 'rfid_uid'],
          where: year_level ? { year_level } : {},
        },
        { model: Event, attributes: ['name', 'date'] },
      ],
      order: [['time_in', 'DESC']],
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance logs', error: error.message });
  }
};

export const getAttendanceByEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    const attendance = await Attendance.findAll({
      where: { event_id },
      include: [
        {
          model: User,
          attributes: ['firstname', 'surname', 'student_number', 'year_level'],
        },
      ],
    });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'staff' } });
    const totalEvents = await Event.count();
    const totalAttendance = await Attendance.count();
    const totalFines = await Attendance.sum('fine');

    const presentToday = await Attendance.count({
      where: {
        status: 'Present',
        createdAt: {
          [global.Op?.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const lateToday = await Attendance.count({
      where: {
        status: 'Late',
        createdAt: {
          [global.Op?.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    res.status(200).json({
      totalUsers,
      totalEvents,
      totalAttendance,
      totalFines: totalFines || 0,
      presentToday,
      lateToday,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};
