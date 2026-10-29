@echo off
title Student Attendance Management System - Class 10 IT
cd /d "%~dp0"
echo ======================================================================
echo   STARTING STUDENT ATTENDANCE MANAGEMENT SYSTEM (CLASS 10 IT PROJECT)
echo   Local Web App URL: http://localhost:5000
echo ======================================================================
timeout /t 2 >nul
start "" "http://localhost:5000"
node server/server.js
pause
