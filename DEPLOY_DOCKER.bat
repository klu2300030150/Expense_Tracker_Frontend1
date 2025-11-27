@echo off
title Deploy to Docker
color 0B

echo ================================================================
echo       EXPENSE TRACKER - DOCKER DEPLOYMENT
echo ================================================================
echo.

:: Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not running!
    echo.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running!
echo.

cd /d "%~dp0"

:: Stop existing containers
echo [1/4] Stopping existing containers...
docker-compose down 2>nul

:: Build images
echo.
echo [2/4] Building Docker images...
docker-compose build

:: Start containers
echo.
echo [3/4] Starting containers...
docker-compose up -d

:: Wait for services
echo.
echo [4/4] Waiting for services to start...
timeout /t 10 >nul

:: Check status
echo.
echo ================================================================
echo                 CONTAINER STATUS
echo ================================================================
docker-compose ps

echo.
echo ================================================================
echo            DOCKER DEPLOYMENT COMPLETE!
echo ================================================================
echo.
echo Frontend: http://localhost:80
echo Backend:  http://localhost:5000
echo Health:   http://localhost:5000/api/health
echo.
echo Commands:
echo   View logs:     docker-compose logs -f
echo   Stop:          docker-compose down
echo   Restart:       docker-compose restart
echo.

:: Open browser
start http://localhost

pause
