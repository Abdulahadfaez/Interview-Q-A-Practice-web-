@echo off
REM Interview Q&A Practice - Startup Script for Windows
REM This script starts both backend and frontend servers

ECHO.
ECHO ========================================
ECHO Interview Q&A Practice Application
ECHO ========================================
ECHO.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then restart this script.
    pause
    exit /b 1
)

echo Node.js is installed.
echo.

REM Check if in correct directory
if not exist "backend\package.json" (
    echo ERROR: Backend folder not found!
    echo.
    echo Please run this script from the project root directory.
    echo (Where backend\ and frontend\ folders are located)
    pause
    exit /b 1
)

echo Directory verified.
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "backend\node_modules" (
    echo.
    echo Installing backend dependencies...
    echo (This may take 1-2 minutes)
    echo.
    cd backend
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo All checks passed!
echo.
ECHO ========================================
ECHO ✓ Starting Backend Server...
ECHO   (This window will display server logs)
ECHO ========================================
ECHO.
ECHO Keep this window open while using the app!
ECHO.

REM Start backend server
cd backend
start cmd /k "npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

echo.
ECHO ========================================
ECHO ✓ Starting Frontend Server...
ECHO   (New window will open)
ECHO ========================================
ECHO.

REM Start frontend server in new window


cd ..
cd frontend
start cmd /k "python -m http.server 8000"

echo.
echo ========================================
echo ✓ Both servers starting!
echo.
echo Frontend URL: http://localhost:8000
echo Backend API: http://localhost:5000
echo.
echo The application will open shortly...
echo ========================================
echo.

REM Wait a moment and open browser
timeout /t 2 /nobreak
start http://localhost:8000

echo Application is starting!
echo Please wait for the login page to load...
echo.
pause
