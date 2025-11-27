@echo off
title Expense Tracker - Deployment Menu
color 0F

:MENU
cls
echo ================================================================
echo         EXPENSE TRACKER - DEPLOYMENT AUTOMATION
echo ================================================================
echo.
echo   Your AWS RDS Database:
echo   expensetrackerbackend.cxy4ogqqgubd.eu-north-1.rds.amazonaws.com
echo.
echo ================================================================
echo.
echo   Choose a deployment option:
echo.
echo   [1] LOCAL      - Run locally with MySQL (Development)
echo   [2] DOCKER     - Deploy with Docker Compose
echo   [3] KUBERNETES - Deploy to Kubernetes (Docker Desktop)
echo   [4] AWS        - Deploy to AWS EC2 with Ansible
echo.
echo   [5] Stop All Local Services
echo   [6] Git Push to GitHub
echo   [7] Check Health Status
echo.
echo   [0] Exit
echo.
echo ================================================================
set /p choice="Enter your choice (0-7): "

if "%choice%"=="1" goto LOCAL
if "%choice%"=="2" goto DOCKER
if "%choice%"=="3" goto K8S
if "%choice%"=="4" goto AWS
if "%choice%"=="5" goto STOP
if "%choice%"=="6" goto GIT
if "%choice%"=="7" goto HEALTH
if "%choice%"=="0" goto EXIT

echo Invalid choice! Please try again.
timeout /t 2 >nul
goto MENU

:LOCAL
cls
echo Starting Local Development...
call FULL_AUTOMATION.bat
goto MENU

:DOCKER
cls
echo Starting Docker Deployment...
call DEPLOY_DOCKER.bat
goto MENU

:K8S
cls
echo Starting Kubernetes Deployment...
call DEPLOY_K8S.bat
goto MENU

:AWS
cls
echo Starting AWS Deployment...
call DEPLOY_AWS.bat
goto MENU

:STOP
cls
echo ================================================================
echo              STOPPING ALL SERVICES
echo ================================================================
echo.
echo Stopping local processes...
powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"

echo Stopping Docker containers...
docker-compose down 2>nul

echo Stopping Kubernetes...
kubectl delete namespace expense-tracker 2>nul

echo.
echo All services stopped!
pause
goto MENU

:GIT
cls
echo ================================================================
echo              PUSHING TO GITHUB
echo ================================================================
echo.
cd /d "%~dp0"
git add -A
set /p msg="Enter commit message: "
git commit -m "%msg%"
git push
echo.
echo Push complete!
pause
goto MENU

:HEALTH
cls
echo ================================================================
echo              HEALTH CHECK
echo ================================================================
echo.
echo Checking Local Backend (port 5000)...
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 3).Content } catch { 'Not running' }"
echo.
echo Checking Docker Frontend (port 80)...
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:80' -UseBasicParsing -TimeoutSec 3).StatusCode } catch { 'Not running' }"
echo.
echo Checking Kubernetes Frontend (port 30080)...
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:30080' -UseBasicParsing -TimeoutSec 3).StatusCode } catch { 'Not running' }"
echo.
echo Checking Kubernetes Backend (port 30050)...
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:30050/api/health' -UseBasicParsing -TimeoutSec 3).Content } catch { 'Not running' }"
echo.
pause
goto MENU

:EXIT
echo.
echo Goodbye!
exit /b 0
