@echo off
echo ============================================
echo  Ansible Deployment for Expense Tracker
echo ============================================
echo.

:: Check if WSL is available (for Windows users)
where wsl >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Using WSL to run Ansible...
    echo.
    
    :: Ask user for EC2 IP
    set /p EC2_IP="Enter your EC2 Public IP: "
    
    :: Update inventory file with IP
    echo Updating inventory.ini with IP: %EC2_IP%
    
    :: Run Ansible via WSL
    echo.
    echo Running deployment...
    wsl bash -c "cd /mnt/c/Users/sreek/OneDrive/Pictures/Camera\ Roll/Desktop/Expense_Tracker_Frontend-main\ \(1\)/Expense_Tracker_Frontend-main/ansible && ansible-playbook -i inventory.ini site.yml"
    
) else (
    echo.
    echo ERROR: WSL not found!
    echo.
    echo To run Ansible on Windows, you need:
    echo 1. Install WSL: wsl --install
    echo 2. Install Ansible in WSL: sudo apt install ansible
    echo.
    echo Alternative: Run from a Linux/Mac machine or use the manual steps:
    echo 1. SSH into your EC2 instance
    echo 2. Run aws-setup.sh script
    echo.
)

pause
