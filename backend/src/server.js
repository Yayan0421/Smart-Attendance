import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/database.js';
import { errorHandler } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import User from './models/User.js';
import Attendance from './models/Attendance.js';
import supabaseService from './services/supabaseService.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory logs for RFID simulation
let logs = [];

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: false,
}));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/attendance', attendanceRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// RFID Simulation Hardware Endpoints
// Receive RFID card scan from ESP32 - Uses Supabase REST API
app.post('/rfid-scan', async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ status: 'error', message: 'UID is required' });
    }

    // Find user by RFID UID using Supabase
    const user = await supabaseService.findUserByUID(uid);

    if (!user) {
      console.log('RFID SCAN: Unknown UID -', uid);
      return res.status(404).json({ 
        status: 'error', 
        message: 'User not found',
        uid 
      });
    }

    const now = new Date();
    const timestamp = now.toLocaleString();
    let action = 'TIME IN';

    // Check if user already has attendance record for today
    const todayAttendance = await supabaseService.findTodayAttendance(user.id);

    // If attendance exists for today, it's TIME OUT
    if (todayAttendance) {
      action = 'TIME OUT';
      console.log(`RFID SCAN: ${action} - ${user.firstname} ${user.surname} (${uid}) at ${timestamp}`);
    } else {
      // Create new attendance record for TIME IN
      await supabaseService.createAttendance(user.id);
      console.log(`RFID SCAN: ${action} - ${user.firstname} ${user.surname} (${uid}) at ${timestamp}`);
    }

    logs.push({ uid, name: `${user.firstname} ${user.surname}`, action, time: timestamp });

    res.json({
      status: 'success',
      uid,
      name: `${user.firstname} ${user.surname}`,
      action,
      timestamp,
      user_id: user.id,
    });
  } catch (error) {
    console.error('RFID Scan error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
});

// Get simulation logs for dashboard
app.get('/logs', (req, res) => {
  res.json(logs);
});

// Clear logs endpoint (useful for testing)
app.post('/logs/clear', (req, res) => {
  logs = [];
  console.log('Logs cleared');
  res.json({ status: 'ok', message: 'Logs cleared' });
});

// Error handling
app.use(errorHandler);

// Database initialization
const initializeDatabase = async () => {
  try {
    // Test Supabase connection
    console.log('Testing Supabase connection...');
    const isConnected = await supabaseService.testConnection();
    
    if (!isConnected) {
      throw new Error('Failed to connect to Supabase');
    }

    // Create test user if needed
    try {
      const testUser = await supabaseService.findUserByUID('A1B2C3D4');
      if (!testUser) {
        console.log('Creating test user...');
        await supabaseService.insert('users', {
          surname: 'Dela Cruz',
          firstname: 'Juan',
          email: 'test@example.com',
          rfid_uid: 'A1B2C3D4',
          role: 'staff'
        });
        console.log('✅ Test user created');
      } else {
        console.log('✅ Test user already exists');
      }
    } catch (err) {
      console.log('Note: Could not create test user -', err.message);
    }

  } catch (error) {
    console.error('Database initialization error:', error.message);
  }
};

app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Server running on port ${PORT}`);
});
