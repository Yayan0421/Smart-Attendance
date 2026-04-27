import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/database.js';
import { errorHandler } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import { receivePendingRFID } from './controllers/attendanceController.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configuration with proper local network request handling
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      // Allow requests from the same machine (for development)
      /^http:\/\/localhost/,
      /^http:\/\/127\.0\.0\.1/,
      /^http:\/\/\d+\.\d+\.\d+\.\d+/, // Allow private IP ranges
    ];
    
    // Allow requests without origin (like mobile apps or local RFID hardware)
    if (!origin || allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Local-Network-Request'],
  exposedHeaders: ['X-Local-Network-Request'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Add headers to handle local network requests
app.use((req, res, next) => {
  // Signal that this server accepts local network requests
  res.header('X-Local-Network-Request', 'true');
  // Ensure proper cross-origin handling
  res.header('Access-Control-Allow-Private-Network', 'true');
  next();
});

// RFID scan endpoint from hardware/Wokwi (no auth required)
app.post('/rfid-scan', receivePendingRFID);

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/attendance', attendanceRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

// Database initialization
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced');

    // Create default admin user if not exists
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        surname: 'Admin',
        firstname: 'System',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Server running on port ${PORT}`);
});
