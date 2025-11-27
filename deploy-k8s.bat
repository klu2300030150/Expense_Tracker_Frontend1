@echo off
echo ========================================
echo Expense Tracker - Kubernetes Deployment
echo ========================================

echo.
echo Step 1: Building Docker images...
docker build -t expense-tracker-backend:latest -f Dockerfile .
docker build -t expense-tracker-frontend:latest -f Dockerfile.frontend .

echo.
echo Step 2: Creating namespace...
kubectl apply -f k8s/namespace.yaml

echo.
echo Step 3: Creating secrets...
kubectl apply -f k8s/mysql-secret.yaml

echo.
echo Step 4: Deploying MySQL...
kubectl apply -f k8s/mysql-deployment.yaml
echo Waiting for MySQL to be ready...
kubectl wait --for=condition=ready pod -l app=mysql -n expense-tracker --timeout=120s

echo.
echo Step 5: Deploying Backend...
kubectl apply -f k8s/backend-deployment.yaml
echo Waiting for Backend to be ready...
kubectl wait --for=condition=ready pod -l app=backend -n expense-tracker --timeout=60s

echo.
echo Step 6: Deploying Frontend...
kubectl apply -f k8s/frontend-deployment.yaml
echo Waiting for Frontend to be ready...
kubectl wait --for=condition=ready pod -l app=frontend -n expense-tracker --timeout=60s

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Get service URL:
kubectl get svc frontend -n expense-tracker
echo.
echo View all pods:
kubectl get pods -n expense-tracker
echo.
pause
