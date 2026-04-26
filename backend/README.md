# Backend API - RFID Attendance System

Node.js + Express.js RESTful API for attendance management.

## Quick Start

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`

## Project Structure

```
src/
├── config/
│   └── database.js         # Sequelize configuration
├── controllers/
│   ├── authController.js   # Login/logout logic
│   ├── userController.js   # User management
│   ├── eventController.js  # Event management
│   └── attendanceController.js  # Attendance scanning & logs
├── middleware/
│   └── auth.js            # JWT & error handling
├── models/
│   ├── User.js            # User model
│   ├── Event.js           # Event model
│   ├── Attendance.js      # Attendance model
│   └── index.js           # Model exports
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── userRoutes.js      # User endpoints
│   ├── eventRoutes.js     # Event endpoints
│   └── attendanceRoutes.js # Attendance endpoints
├── utils/
│   └── jwt.js             # JWT utilities
└── server.js              # Express app
```

## Environment Variables

Create `.env` file from `.env.example`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=rfid_attendance

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### Authentication
```
POST   /auth/login         # Login user
POST   /auth/logout        # Logout user
```

### Users (Protected)
```
GET    /users              # Get all users
GET    /users/:id          # Get user by ID
POST   /users              # Create user (admin only)
PUT    /users/:id          # Update user (admin only)
DELETE /users/:id          # Delete user (admin only)
```

### Events (Protected)
```
GET    /events             # Get all events
GET    /events/:id         # Get event by ID
POST   /events             # Create event (admin only)
PUT    /events/:id         # Update event (admin only)
DELETE /events/:id         # Delete event (admin only)
```

### Attendance (Protected)
```
POST   /attendance/scan    # Record attendance
GET    /attendance/logs    # Get attendance logs
GET    /attendance/stats   # Get dashboard statistics
GET    /attendance/event/:event_id  # Get event attendance
```

## Controllers

### Auth Controller
- **login** - Authenticate user, return JWT token
- **logout** - Clear session

### User Controller
- **getUsers** - Fetch all staff users
- **getUserById** - Fetch specific user
- **createUser** - Create new user
- **updateUser** - Update user info
- **deleteUser** - Delete user

### Event Controller
- **getEvents** - Fetch all events
- **getEventById** - Fetch specific event
- **createEvent** - Create new event
- **updateEvent** - Update event info
- **deleteEvent** - Delete event

### Attendance Controller
- **scanAttendance** - Process RFID scan, record attendance
- **getAttendanceLogs** - Fetch attendance records with filters
- **getAttendanceByEvent** - Get attendance for specific event
- **getDashboardStats** - Get system statistics

## Middleware

### authMiddleware
- Verifies JWT token
- Extracts user from token
- Attaches user to request

### adminMiddleware
- Checks if user role is 'admin'
- Returns 403 if not admin

### errorHandler
- Catches errors globally
- Returns formatted error response

## Database Models

### User
```javascript
{
  id: UUID,
  surname: String,
  firstname: String,
  middlename: String,
  email: String (unique),
  password: String (hashed),
  age: Integer,
  student_number: String (unique, format: XX-XXXXX),
  year_level: Enum('1st Year', '2nd Year', '3rd Year', '4th Year'),
  rfid_uid: String (unique),
  role: Enum('admin', 'staff'),
  profile_photo: Text
}
```

### Event
```javascript
{
  id: UUID,
  name: String,
  date: Date,
  login_time: Time,
  logout_time: Time,
  location: String,
  fine_amount: Decimal
}
```

### Attendance
```javascript
{
  id: UUID,
  user_id: UUID (Foreign Key),
  event_id: UUID (Foreign Key),
  time_in: DateTime,
  status: Enum('Present', 'Late', 'Absent'),
  fine: Decimal
}
```

## Security Features

- **Password Hashing** - Using bcryptjs (10 salt rounds)
- **JWT Authentication** - Token-based auth with expiration
- **CORS Protection** - Limited to frontend origin
- **Input Validation** - On all user inputs
- **Error Messages** - No sensitive info in error responses

## Key Logic

### Attendance Scanning
1. Find user by RFID UID
2. Check for duplicate scans (5-min window)
3. Compare scan time with event login_time
4. Auto-mark as 'Late' if after login_time
5. Apply fine if applicable
6. Return result with student info

### Late Detection
```javascript
if (scanTime > eventLoginTime) {
  status = 'Late'
  fine = event.fine_amount
}
```

## Development Commands

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start

# Test (when implemented)
npm test
```

## Error Handling

All errors return JSON response:
```json
{
  "message": "Error description",
  "error": "Detailed error info"
}
```

## Database Connection

Uses Sequelize ORM with MySQL:
```javascript
// Automatic syncing on startup
sequelize.sync({ force: false })
```

## Testing the API

### Using cURL

Login:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

Get Users (with token):
```bash
curl -X GET http://localhost:5000/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create `POST` request to `/auth/login`
2. Body (raw JSON):
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
3. Use returned token in Authorization header
4. Test other endpoints

## Performance Optimization

- Database indexes on frequently queried fields
- Connection pooling via Sequelize
- Error logging
- Efficient query selection

## Scaling Considerations

- Move to dedicated database server
- Implement caching (Redis)
- Add API rate limiting
- Load balancing for multiple instances
- Message queue for heavy operations

## Dependencies

```
- express: Web framework
- mysql2: MySQL driver
- sequelize: ORM
- bcryptjs: Password hashing
- jsonwebtoken: JWT creation/verification
- cors: CORS middleware
- dotenv: Environment variables
- express-validator: Input validation
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Move to industrial-grade database
3. Set strong `JWT_SECRET`
4. Enable HTTPS
5. Add monitoring/logging
6. Set up CI/CD pipeline
7. Use process manager (PM2)

## Troubleshooting

**MySQL Connection Error**
- Check DB_HOST, DB_USER, DB_PASSWORD
- Ensure MySQL service running

**Token Invalid**
- Verify JWT_SECRET is consistent
- Check token hasn't expired

**Port Already in Use**
- Change PORT in .env
- Kill process: `lsof -ti:5000 | xargs kill`

---

**Happy Coding!** 🚀
