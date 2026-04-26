import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Event from '../models/Event.js';

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
