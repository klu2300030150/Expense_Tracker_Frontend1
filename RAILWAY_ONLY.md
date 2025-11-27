# 🚂 Railway Only - Simple Deploy

## Your Current Setup:
✅ Railway MySQL database (running)
❌ Backend service (needs to be added)

---

## 🚀 Add Backend Service to Railway (3 minutes):

### Step 1: Add New Service
1. In your Railway project dashboard, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose: **`klu2300030150/Expense_Tracker_Frontend1`**
4. Railway will detect your Node.js app and start deploying

### Step 2: Wait for Build
- Railway will automatically:
  - Run `npm install`
  - Start your server with `node server.js`
  - The build takes 2-3 minutes

### Step 3: Backend Connects to MySQL Automatically
Your backend will automatically connect to the MySQL database because:
- Railway shares environment variables between services in the same project
- Your server.js now reads both `MYSQLHOST` and `MYSQL_HOST` variables
- No manual configuration needed! ✅

### Step 4: Generate Public Domain
1. Click on your **backend service** (not MySQL)
2. Go to **Settings** tab
3. Scroll to **Networking**
4. Click **"Generate Domain"**
5. **Copy the URL** (e.g., `https://expense-tracker-production-xxxx.up.railway.app`)

### Step 5: Test Backend
Open in browser:
```
https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{"status":"ok","database":"connected"}
```

---

## ⚡ After Getting Your URL:

Run this command:
```powershell
.\update-backend-url.ps1 -RailwayURL "https://your-railway-url.up.railway.app"
```

Done! Your GitHub Pages site will connect to Railway backend!

---

## About Free Credits:
- Railway gives **$5 free credits per month**
- MySQL + small backend = ~$3-4/month
- **You should stay within free limits!**
- If it asks to upgrade, just add a payment method (won't charge unless you exceed $5)
