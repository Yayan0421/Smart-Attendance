# Setup Guide - RFID Attendance System

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://www.mysql.com/downloads/)
- **npm** (comes with Node.js)

## Step-by-Step Installation

### 1. Database Setup

#### Option A: Using MySQL Command Line

1. Open MySQL:
```bash
mysql -u root -p
```

2. Create the database:
```sql
CREATE DATABASE rfid_attendance;
USE rfid_attendance;
```

3. Exit MySQL:
```sql
EXIT;
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Create New Schema named `rfid_attendance`
3. Apply changes

### 2. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with database credentials:
```bash
cp .env.example .env
```

4. Edit `.env` file:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=rfid_attendance
PORT=5000
NODE_ENV=development
JWT_SECRET=rfid_attendance_secret_key_2024
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

Expected output:
```
Server running on port 5000
Database synced
Default admin user created
```

### 3. Frontend Setup

In a **new terminal**, navigate to frontend:

1. Go to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

## 4. Access the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. Login with demo credentials:
   - **Email:** admin@example.com
   - **Password:** password123

## Troubleshooting

### MySQL Connection Error

**Error:** `connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
1. Ensure MySQL service is running
2. Check MySQL port is 3306
3. Verify username/password in `.env`
4. Try creating database manually

### Port 5000 Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Change PORT in backend `.env` file
2. Or kill the process using port 5000

### Port 5173 Already in Use

**Error:** `error: listen EADDRINUSE: address already in use :::5173`

**Solution:**
```bash
cd frontend
npm run dev -- --port 5174
```

### Dependencies Not Installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Database Not Syncing

**Solution:**
1. Delete the database: `DROP DATABASE rfid_attendance;`
2. Create new database: `CREATE DATABASE rfid_attendance;`
3. Restart backend server

## Default Admin User

The system automatically creates an admin user on first run:

- **Email:** admin@example.com
- **Password:** password123

⚠️ **Important:** Change this password after first login!

## Project Structure Quick Reference

```
MIcrop/
├── backend/          # Node.js API Server
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
├── frontend/         # React Application
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Development Commands

### Backend
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Database Models

The system uses 3 main tables:

### Users
- Stores student information
- RFID UID mapping
- Role management (admin/staff)

### Events
- Event details
- Time windows (login/logout)
- Fine amounts

### Attendance
- Attendance records
- Time in/status/fine
- Links users and events

## Key Features to Test

1. **Login** - Test with demo credentials
2. **Add User** - Create a new student (email optional)
3. **Add Event** - Create an event
4. **Register RFID** - Assign RFID UID to student
5. **Scan Attendance** - Simulate RFID scanning
6. **View Logs** - Check attendance records
7. **Export CSV** - Download attendance log

## API Testing

Use Postman or similar tool to test APIs:

1. Login first:
```
POST http://localhost:5000/auth/login
Body: {
  "email": "admin@example.com",
  "password": "password123"
}
```

2. Use returned token in Authorization header:
```
Authorization: Bearer <token>
```

## Next Steps

1. ✅ Configure database
2. ✅ Install packages
3. ✅ Start backend
4. ✅ Start frontend
5. ✅ Login with demo account
6. ✅ Explore modules
7. ✅ Create test data

## Performance Tips

- Use strong WiFi connection
- Keep MySQL running
- Monitor RAM usage
- Clear browser cache periodically
- Use production build for deployment

## Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Sequelize Documentation](https://sequelize.org)
- [Tailwind CSS](https://tailwindcss.com)

## Support

If you encounter issues:
1. Check error messages carefully
2. Verify all prerequisites are installed
3. Check `.env` configuration
4. Review database connection
5. Check if ports are available

---

**Happy Scanning!** 📡
