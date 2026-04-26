@echo off
echo.
echo ===================================
echo RFID Attendance System - Startup
echo ===================================
echo.
echo Starting Backend Server...
echo.
start cmd /k "cd backend && npm run dev"
echo.
echo Backend started! Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak
echo.
echo Starting Frontend Development Server...
echo.
start cmd /k "cd frontend && npm run dev"
echo.
echo ===================================
echo Both servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ===================================
echo.
pause
