# ✅ Pre-Launch Checklist

Use this checklist to ensure everything is ready!

## 🔧 Installation Checklist

### Dependencies
- [ ] Backend npm packages installed (144 packages)
- [ ] Frontend npm packages installed (193 packages)
- [ ] No npm error messages

### Project Structure
- [ ] backend/ folder with src/ and node_modules/
- [ ] frontend/ folder with src/ and node_modules/
- [ ] Documentation files present (README.md, SETUP_GUIDE.md, etc.)
- [ ] start.bat and start.ps1 files present

### Configuration
- [ ] backend/.env created (or using defaults)
- [ ] MySQL database NAME: `rfid_attendance`
- [ ] Database is accessible

## 🗄️ Database Setup

- [ ] MySQL service running
- [ ] Database `rfid_attendance` created
- [ ] Database is empty (fresh installation)

Run this in MySQL:
```sql
CREATE DATABASE rfid_attendance;
```

## 🚀 Server Startup Checklist

### Backend
- [ ] `cd backend && npm run dev` works
- [ ] Backend terminal shows: "Server running on port 5000"
- [ ] No connection errors displayed
- [ ] Database synced automatically
- [ ] Default admin user created
- [ ] Health endpoint: http://localhost:5000/health returns OK

### Frontend
- [ ] `cd frontend && npm run dev` works
- [ ] Frontend terminal shows: "Local: http://localhost:5173"
- [ ] No build errors or warnings
- [ ] Browser auto-opens to http://localhost:5173

## 🔐 Authentication Test

- [ ] Can navigate to http://localhost:5173
- [ ] Login page loads properly
- [ ] Demo credentials displayed on login page
- [ ] Can login with: admin@example.com / password123
- [ ] Dashboard loads after login
- [ ] Token stored in localStorage
- [ ] Can navigate between pages

## 📊 Feature Verification

### Dashboard
- [ ] Dashboard page loads
- [ ] Statistics cards display
- [ ] Charts render without errors
- [ ] Numbers show (even if 0 initially)

### Users Page
- [ ] Users page accessible
- [ ] "Add User" button works
- [ ] Student number format validates (XX-XXXXX)
- [ ] Form validation working

### Events Page
- [ ] Events page accessible
- [ ] "Add Event" button works
- [ ] Can create new event
- [ ] Event displays in list

### RFID Registration
- [ ] RFID page accessible
- [ ] "Scan Card" button working
- [ ] RFID UID generated
- [ ] Can enter student info

### Attendance Scanning
- [ ] Scan page accessible
- [ ] Can select event
- [ ] Can simulate RFID scan
- [ ] Scan results display

### Attendance Logs
- [ ] Logs page accessible
- [ ] Can filter by year level
- [ ] Export CSV button present
- [ ] Data displays in table

### Profile
- [ ] Profile page loads
- [ ] Current user info displays
- [ ] Can edit profile (optional)

## 🔌 API Connectivity

- [ ] Backend API responding
- [ ] Frontend receiving data from API
- [ ] No CORS errors in console
- [ ] No 401/403 errors
- [ ] Token being sent with requests

## 📱 Responsive Design Test

- [ ] Shrink browser (test mobile view)
- [ ] Sidebar collapses to hamburger menu
- [ ] Mobile menu works
- [ ] Tables still readable
- [ ] Forms still functional
- [ ] Layout responsive at all sizes

## 🎨 UI/UX Verification

- [ ] Blue color palette applied correctly
- [ ] Sidebar highlights active menu item
- [ ] Buttons have hover effects
- [ ] Cards have proper styling
- [ ] Forms have proper spacing
- [ ] Smooth animations present

## ⚡ Performance Checks

- [ ] Dashboard loads within 2 seconds
- [ ] Page transitions smooth
- [ ] No console errors from JavaScript
- [ ] No warnings in browser console
- [ ] API responses quick

## 🔍 Data Flow Test

Complete this workflow:

1. **Create Event**
   - [ ] Navigate to Events page
   - [ ] Click "Add Event"
   - [ ] Fill form (name, date, times, fine amount)
   - [ ] Submit and verify in list

2. **Add Student**
   - [ ] Navigate to Users page
   - [ ] Click "Add User"
   - [ ] Fill all fields
   - [ ] Student number format: XX-XXXXX
   - [ ] Submit and verify in list

3. **Register RFID**
   - [ ] Navigate to RFID Cards page
   - [ ] Click "Register Card"
   - [ ] Click "Scan Card" button
   - [ ] Verify UID generated
   - [ ] Fill student info
   - [ ] Submit and verify in list

4. **Scan Attendance**
   - [ ] Navigate to Scanning page
   - [ ] Select event created
   - [ ] Simulate RFID scan
   - [ ] Verify scan result displays
   - [ ] Check student name appears

5. **View Logs**
   - [ ] Navigate to Attendance Logs
   - [ ] Verify attendance record appears
   - [ ] Filter by year level works
   - [ ] Export CSV works

## 🛠️ Browser DevTools

- [ ] Open DevTools (F12)
- [ ] Check Console tab for errors
- [ ] Check Network tab for failed requests
- [ ] Check Application > Storage for token
- [ ] No 404 errors for assets

## 📋 Final Verification

- [ ] Both servers started successfully
- [ ] No unresolved errors
- [ ] Can complete full workflow
- [ ] Data persists after refresh
- [ ] Logout works properly
- [ ] Can login again

## 🎉 Ready to Launch!

If all checkboxes are checked:
- ✅ Backend working
- ✅ Frontend working
- ✅ Database connected
- ✅ Authentication working
- ✅ All features functional
- ✅ Responsive design working
- ✅ Performance acceptable

## 📞 If Something's Wrong

Check these in order:

1. **Backend not starting?**
   - [ ] Check MySQL running
   - [ ] Check port 5000 available
   - [ ] Review .env file
   - [ ] Check terminal for specific error

2. **Frontend not loading?**
   - [ ] Check port 5173 available
   - [ ] Clear browser cache (Ctrl+Shift+Delete)
   - [ ] Check backend running (API accessible)
   - [ ] Check console for errors (F12)

3. **Blank page or errors?**
   - [ ] Check browser console (F12)
   - [ ] Check network tab for failed requests
   - [ ] Verify backend running
   - [ ] Try hard refresh (Ctrl+F5)

4. **Login not working?**
   - [ ] Verify backend running
   - [ ] Check email/password correct
   - [ ] Check network requests in DevTools
   - [ ] Look for API error messages

5. **Data not saving?**
   - [ ] Check MySQL connected
   - [ ] Verify database exists
   - [ ] Check backend logs for errors
   - [ ] Verify timestamps in console

## 📚 Help Resources

- QUICKSTART.md - Quick start guide
- SETUP_GUIDE.md - Detailed setup
- README.md - Full documentation
- DATABASE_SCHEMA.md - Database info
- backend/README.md - API reference
- frontend/README.md - Frontend guide

---

**Once All Boxes Are Checked: Launch! 🚀**

The system is ready for production use!
