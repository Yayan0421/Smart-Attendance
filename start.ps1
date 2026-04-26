#!/usr/bin/env pwsh

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "RFID Attendance System - Startup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend Server (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Write-Host "Waiting 3 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server (port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "===================================" -ForegroundColor Green
Write-Host "Both servers started!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor Cyan
Write-Host "Email:    admin@example.com" -ForegroundColor White
Write-Host "Password: password123" -ForegroundColor White
Write-Host ""
