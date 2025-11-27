# Render Backend Deployment

## Your Backend will be deployed on Render (FREE)
## Frontend on GitHub Pages will connect to Render → AWS RDS

### Steps:

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repo: klu2300030150/Expense_Tracker_Frontend1
5. Configure:
   - Name: expense-tracker-backend
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
   
6. Add Environment Variables:
   - MYSQL_HOST = expensetrackerbackend.cxy4ogqqgubd.eu-north-1.rds.amazonaws.com
   - MYSQL_PORT = 3306
   - MYSQL_USER = admin
   - MYSQL_PASSWORD = Sreekar8297
   - MYSQL_DATABASE = ExpenseTrackerBackend

7. Click "Create Web Service"

Your backend URL will be: https://expense-tracker-backend.onrender.com
