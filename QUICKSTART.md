# ⚡ Quick Start Guide

Get the RFID Attendance System running in 2 minutes!

## Prerequisites

✅ Node.js (v16+) - [Download](https://nodejs.org/)  
✅ MySQL (v8+) - [Download](https://www.mysql.com/)  
✅ npm (comes with Node.js)

## Option 1: Automated Startup (Windows)

### Using Batch File
```bash
start.bat
```

Or using PowerShell:
```bash
.\start.ps1
```

Both commands automatically:
- Start backend on port 5000
- Start frontend on port 5173 (after 3 seconds)
- Two new command windows open automatically

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

```
✅ Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

```
✅ Frontend running on http://localhost:5173
```

## Setting Up Database

### Windows Command Prompt or PowerShell

1. **Start MySQL:**
```bash
mysql -u root -p
```

2. **Create Database:**
```sql
CREATE DATABASE rfid_attendance;
EXIT;
```

The backend will automatically create tables on first run.

### macOS/Linux Terminal

```bash
mysql -u root -p < CREATE DATABASE rfid_attendance;
```

## 🎯 Login

1. Open browser: **http://localhost:5173**
2. Login with demo credentials:

```
Email:    admin@example.com
Password: password123
```

## 📊 Features to Try

### 1. **Dashboard**
- View system statistics
- Check monthly charts
- See attendance overview

### 2. **Add Users**
- Click "Add User"
- Fill in student info
- Format: Student Number `25-00017`

### 3. **Add Events**
- Create new event
- Set login time
- Configure fine amount

### 4. **Register RFID**
- Click "Scan Card" (simulated)
- Gets random RFID UID
- Link to student

### 5. **Scan Attendance**
- Select event
- Simulate RFID scan
- View results

### 6. **View Logs**
- Filter by year level
- Search students
- Export CSV

## 🔄 Typical Workflow

```
1. Create Event (Events page)
   ↓
2. Add/Register Users (Users & RFID pages)
   ↓
3. Start Scanning (Scanning page)
   ↓
4. Check Results (Attendance Logs)
   ↓
5. View Analytics (Dashboard)
```

## 🛠 Troubleshooting

### MySQL Not Connecting?
```bash
# Verify MySQL is running
mysql -u root -p

# Check credentials in backend/.env
DB_USER=root
DB_PASSWORD=your_password
```

### Port Already in Use?

**Port 5000:**
```bash
# Change in backend/.env
PORT=5001
```

**Port 5173:**
```bash
cd frontend
npm run dev -- --port 5174
```

### Dependencies Failed?
```bash
cd backend
npm cache clean --force
rm package-lock.json
npm install

cd ../frontend
npm cache clean --force
rm package-lock.json
npm install
```

## 📁 Project Structure

```
MIcrop/
├── backend/          ← Node.js API
├── frontend/         ← React App
├── start.bat         ← Auto startup (Windows)
├── start.ps1         ← Auto startup (PowerShell)
├── README.md         ← Full documentation
├── SETUP_GUIDE.md    ← Detailed setup
└── DATABASE_SCHEMA.md ← Database info
```

## 📡 API Endpoints (for testing)

```
POST   http://localhost:5000/auth/login
GET    http://localhost:5000/users
GET    http://localhost:5000/events
POST   http://localhost:5000/attendance/scan
GET    http://localhost:5000/attendance/logs
```

## 🔐 Default Accounts

```
Admin Account
├─ Email: admin@example.com
└─ Password: password123
```

⚠️ **Change password after first login!**

## 📞 Need Help?

- Check error messages in terminal
- Backend logs: `npm run dev` terminal
- Frontend logs: Browser console (F12)
- Review `SETUP_GUIDE.md` for detailed help

## ✨ Quick Links

- [Full Documentation](README.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Detailed Setup](SETUP_GUIDE.md)
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

---

**Enjoy! 🚀**

Questions? Check the documentation files or review the source code comments.
