@echo off
title Expense Tracker - Full Automation
color 0A

echo ================================================================
echo         EXPENSE TRACKER - FULL AUTOMATION SCRIPT
echo ================================================================
echo.
echo This script will:
echo   1. Start MySQL (if not running)
echo   2. Start Backend Server
echo   3. Start Frontend Dev Server
echo   4. Open the application in browser
echo.
echo ================================================================
pause

:: Kill any existing processes on ports
echo.
echo [1/5] Cleaning up existing processes...
powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
timeout /t 2 >nul

:: Start MySQL Service
echo.
echo [2/5] Starting MySQL Service...
net start MySQL80 2>nul
if %ERRORLEVEL% EQU 0 (
    echo MySQL started successfully!
) else (
    echo MySQL already running or service name different - continuing...
)

:: Navigate to project directory
cd /d "%~dp0"

:: Install dependencies if needed
echo.
echo [3/5] Checking dependencies...
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

:: Start Backend Server in new window
echo.
echo [4/5] Starting Backend Server on port 5000...
start "Expense Tracker Backend" cmd /k "cd /d "%~dp0" && node server.js"

:: Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 >nul

:: Start Frontend Dev Server in new window
echo.
echo [5/5] Starting Frontend Dev Server...
start "Expense Tracker Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

:: Wait for frontend to start
echo Waiting for frontend to initialize...
timeout /t 8 >nul

:: Open browser
echo.
echo ================================================================
echo Opening application in browser...
echo ================================================================
start http://localhost:5173

echo.
echo ================================================================
echo              APPLICATION IS NOW RUNNING!
echo ================================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo Health:   http://localhost:5000/api/health
echo.
echo To stop: Close the Backend and Frontend terminal windows
echo ================================================================
echo.
pause
