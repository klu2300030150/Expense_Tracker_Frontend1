@echo off
title Deploy to AWS with Ansible
color 0E

echo ================================================================
echo       EXPENSE TRACKER - AWS DEPLOYMENT AUTOMATION
echo ================================================================
echo.

:: Check if WSL is available
where wsl >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: WSL is not installed!
    echo.
    echo To install WSL:
    echo   1. Open PowerShell as Administrator
    echo   2. Run: wsl --install
    echo   3. Restart your computer
    echo   4. Run this script again
    echo.
    pause
    exit /b 1
)

:: Get EC2 IP from user
echo.
set /p EC2_IP="Enter your EC2 Public IP Address: "

if "%EC2_IP%"=="" (
    echo ERROR: EC2 IP is required!
    pause
    exit /b 1
)

:: Get SSH Key path
echo.
set /p KEY_PATH="Enter path to your .pem key file (e.g., C:\Users\you\.ssh\key.pem): "

if "%KEY_PATH%"=="" (
    echo ERROR: SSH key path is required!
    pause
    exit /b 1
)

:: Convert Windows path to WSL path
set WSL_KEY_PATH=%KEY_PATH:\=/%
set WSL_KEY_PATH=%WSL_KEY_PATH:C:=/mnt/c%

:: Update inventory file
echo.
echo Updating inventory file with EC2 IP: %EC2_IP%
cd /d "%~dp0"

:: Create temporary inventory for this deployment
echo [webservers] > ansible\inventory_deploy.ini
echo %EC2_IP% ansible_user=ec2-user ansible_ssh_private_key_file=%WSL_KEY_PATH% ansible_ssh_common_args='-o StrictHostKeyChecking=no' >> ansible\inventory_deploy.ini

echo.
echo ================================================================
echo                   STARTING DEPLOYMENT
echo ================================================================
echo.
echo Target: %EC2_IP%
echo Key: %KEY_PATH%
echo.

:: Run Ansible via WSL
echo Running Ansible deployment...
wsl bash -c "cd '%~dp0ansible' && ansible-playbook -i inventory_deploy.ini site.yml"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo            DEPLOYMENT SUCCESSFUL!
    echo ================================================================
    echo.
    echo Your app is running at: http://%EC2_IP%:5000
    echo Health check: http://%EC2_IP%:5000/api/health
    echo.
) else (
    echo.
    echo ================================================================
    echo            DEPLOYMENT FAILED
    echo ================================================================
    echo.
    echo Check the error messages above.
    echo Common issues:
    echo   - EC2 Security Group not allowing SSH (port 22)
    echo   - Wrong SSH key file
    echo   - EC2 instance not running
    echo.
)

pause
