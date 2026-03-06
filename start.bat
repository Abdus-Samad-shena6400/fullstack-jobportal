@echo off
REM Job Portal - Quick Start Script for Windows
REM This script starts both the backend and frontend servers

echo.
echo ===============================================
echo  Job Portal - Full Stack Application
echo ===============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js v16 or higher
    pause
    exit /b 1
)

echo Checking Node.js version...
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%
echo.

REM Start Backend
echo Starting Backend Server...
cd backend
call npm install > nul 2>&1
start cmd /c "npm start"
echo Backend started - running on http://localhost:5000
timeout /t 3 /nobreak
cd..

REM Start Frontend
echo.
echo Starting Frontend Development Server...
cd frontend
call npm install > nul 2>&1
start cmd /c "npm run dev"
echo Frontend started - running on http://localhost:5173
timeout /t 2 /nobreak

echo.
echo ===============================================
echo Application is ready!
echo ===============================================
echo.
echo Open your browser and navigate to:
echo   → http://localhost:5173/
echo.
echo Backend API:
echo   → http://localhost:5000/api
echo.
echo Close the opened command prompts to stop the servers.
echo.
pause
