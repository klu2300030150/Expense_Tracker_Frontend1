@echo off
title Deploy to Kubernetes
color 0D

echo ================================================================
echo       EXPENSE TRACKER - KUBERNETES DEPLOYMENT
echo ================================================================
echo.

:: Check if kubectl is available
where kubectl >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: kubectl is not installed or not in PATH!
    echo.
    echo Make sure Docker Desktop Kubernetes is enabled.
    pause
    exit /b 1
)

:: Check if Kubernetes is running
kubectl cluster-info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Kubernetes cluster is not running!
    echo.
    echo Enable Kubernetes in Docker Desktop:
    echo   1. Open Docker Desktop
    echo   2. Go to Settings ^> Kubernetes
    echo   3. Check "Enable Kubernetes"
    echo   4. Click "Apply & Restart"
    pause
    exit /b 1
)

echo Kubernetes cluster is running!
echo.

cd /d "%~dp0"

echo ================================================================
echo                 DEPLOYING TO KUBERNETES
echo ================================================================
echo.

:: Apply all K8s manifests
echo [1/6] Creating namespace...
kubectl apply -f k8s/namespace.yaml

echo.
echo [2/6] Creating secrets...
kubectl apply -f k8s/mysql-secret.yaml

echo.
echo [3/6] Deploying MySQL...
kubectl apply -f k8s/mysql-deployment.yaml

echo Waiting for MySQL to be ready...
kubectl wait --for=condition=available deployment/mysql -n expense-tracker --timeout=120s 2>nul
timeout /t 10 >nul

echo.
echo [4/6] Deploying Backend...
kubectl apply -f k8s/backend-deployment.yaml

echo Waiting for Backend to be ready...
kubectl wait --for=condition=available deployment/backend -n expense-tracker --timeout=120s 2>nul

echo.
echo [5/6] Deploying Frontend...
kubectl apply -f k8s/frontend-deployment.yaml

echo Waiting for Frontend to be ready...
kubectl wait --for=condition=available deployment/frontend -n expense-tracker --timeout=120s 2>nul

echo.
echo [6/6] Checking deployment status...
timeout /t 5 >nul

echo.
echo ================================================================
echo                    POD STATUS
echo ================================================================
kubectl get pods -n expense-tracker

echo.
echo ================================================================
echo                   SERVICE STATUS
echo ================================================================
kubectl get services -n expense-tracker

echo.
echo ================================================================
echo          KUBERNETES DEPLOYMENT COMPLETE!
echo ================================================================
echo.
echo Access the application:
echo   Frontend: http://localhost:30080
echo   Backend:  http://localhost:30050
echo   Health:   http://localhost:30050/api/health
echo.
echo Useful commands:
echo   View pods:     kubectl get pods -n expense-tracker
echo   View logs:     kubectl logs -f deployment/backend -n expense-tracker
echo   Delete all:    kubectl delete namespace expense-tracker
echo.

:: Open browser
start http://localhost:30080

pause
