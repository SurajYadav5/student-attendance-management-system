@echo off
title Student Attendance System - Live Public Cloud Tunnel Launcher
echo =====================================================================
echo    STUDENT ATTENDANCE SYSTEM - LIVE PUBLIC CLOUD TUNNEL LAUNCHER
echo =====================================================================
echo.
echo Starting Student Attendance Server on Port 5000...
cd /d "%~dp0"
start /b node server/server.js
timeout /t 3 /nobreak >nul

echo.
echo Starting Cloudflare Live Public HTTPS Tunnel...
echo Evaluators can open the HTTPS link from any mobile or laptop!
echo.
call npx -y cloudflared tunnel --url http://localhost:5000
pause

