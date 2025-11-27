# 🚀 Deploy Spring Boot Backend to Railway - Step by Step

## 🎯 What This Does:
- Runs your Spring Boot backend 24/7 in the cloud
- Connects to Railway MySQL database (already configured!)
- Makes your app accessible worldwide
- FREE ($5/month credit)

---

## 📋 Step-by-Step Instructions:

### Step 1: Go to Railway
**Open this link**: https://railway.app/

### Step 2: Sign Up / Login
1. Click **"Login"** button (top right)
2. Select **"Login with GitHub"**
3. Authorize Railway to access your GitHub account
4. You'll be redirected to Railway dashboard

### Step 3: Create New Project
1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. If asked, click **"Configure GitHub App"**
4. Select: **`Expense_Tracker_backend`** repository
5. Click **"Deploy Now"**

### Step 4: Railway Auto-Detects Everything! 🎉
Railway will automatically:
- ✅ Detect Spring Boot application
- ✅ Use Maven to build
- ✅ Use Java 17 runtime
- ✅ Set up PORT environment variable
- ✅ Start your application

**Wait 2-3 minutes for build to complete...**

### Step 5: Check Build Logs
1. Click on your project name
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. Watch the logs - you should see:
   ```
   [INFO] Building Expense Tracker Backend 1.0.0
   [INFO] BUILD SUCCESS
   Started ExpenseTrackerApplication in X seconds
   ```

### Step 6: Get Your Backend URL
1. In Railway dashboard, click **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. Railway creates URL like: `https://expense-tracker-backend-production-XXXX.up.railway.app`
5. **COPY THIS URL!** You'll need it for frontend

---

## 🧪 Test Your Backend:

### Test Signup Endpoint:
```powershell
# Replace YOUR-RAILWAY-URL with your actual URL
$url = "https://YOUR-RAILWAY-URL.up.railway.app/api/auth/signup"
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    password = "test123"
    phoneNumber = "1234567890"
    currency = "USD"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "fullName": "Test User",
  "email": "test@example.com",
  "currency": "USD"
}
```

If you see this → Backend is working! ✅

---

## 🔧 Update Frontend with Railway URL:

### Step 1: Edit config.js
Open: `src/config.js`

```javascript
// BEFORE:
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://expense-tracker-backend-production.up.railway.app'  // ← Generic
  : 'http://localhost:8081';

// AFTER (paste your actual Railway URL):
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://expense-tracker-backend-production-XXXX.up.railway.app'  // ← Your URL
  : 'http://localhost:8081';

export default API_BASE_URL;
```

### Step 2: Update CORS in Backend (Optional)
If you get CORS errors, edit `backend/src/main/resources/application.properties`:

```properties
spring.web.cors.allowed-origins=https://klu2300030150.github.io,https://*.railway.app
```

Then commit and push to GitHub (Railway auto-redeploys):
```bash
cd "d:\D Drive\OneDrive - K L University\Desktop\EF2\backend"
git add .
git commit -m "Update CORS for GitHub Pages"
git push
```

### Step 3: Redeploy Frontend
```bash
cd "d:\D Drive\OneDrive - K L University\Desktop\EF2"
git add src/config.js
git commit -m "Update backend URL to Railway"
git push
npm run deploy
```

Wait 2 minutes, then test!

---

## 🌐 Full Architecture After Railway:

```
┌────────────────────────────────────────┐
│  Users Browser                         │
│  (Anywhere in the world)               │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  GitHub Pages (Frontend)               │
│  https://klu2300030150.github.io/      │
│  Expense_Tracker_Frontend/             │
│  • React App                           │
│  • Login/Signup UI                     │
│  • 24/7 Online ✅                       │
└──────────────┬─────────────────────────┘
               │ HTTPS API Calls
               ▼
┌────────────────────────────────────────┐
│  Railway (Backend)                     │
│  https://...railway.app                │
│  • Spring Boot                         │
│  • REST API                            │
│  • JWT Authentication                  │
│  • 24/7 Online ✅                       │
└──────────────┬─────────────────────────┘
               │ JDBC Connection
               ▼
┌────────────────────────────────────────┐
│  Railway MySQL (Database)              │
│  tramway.proxy.rlwy.net:14634          │
│  • Users, Expenses, Budgets            │
│  • 24/7 Online ✅                       │
└────────────────────────────────────────┘
```

---

## ⚙️ Optional: Environment Variables

If you want to customize, add these in Railway Settings → Variables:

| Variable | Value |
|----------|-------|
| `PORT` | 8080 (Railway sets automatically) |
| `JWT_SECRET` | YourSuperSecretKeyForJWT... |
| `CORS_ORIGINS` | https://klu2300030150.github.io |

**Note**: Database credentials are already in `application.properties`, so you don't need to set them!

---

## 🐛 Troubleshooting:

### Build Failed?
**Check Java Version:**
- Railway needs Java 17
- Your `pom.xml` has: `<java.version>17</java.version>` ✅

**Check Logs:**
- Railway dashboard → Deployments → View logs
- Look for red error messages

### Database Connection Error?
Your `application.properties` already has:
```properties
spring.datasource.url=jdbc:mysql://tramway.proxy.rlwy.net:14634/railway
spring.datasource.username=root
spring.datasource.password=FAuqyBgOVquUtJBPKbWBcPqgjkBNisLf
```
This should work! ✅

### CORS Error on Frontend?
Update `application.properties`:
```properties
spring.web.cors.allowed-origins=https://klu2300030150.github.io
```

---

## 📊 Monitoring Your Backend:

### Check if Backend is Running:
Visit: `https://YOUR-RAILWAY-URL.up.railway.app`

You'll see:
```
Whitelabel Error Page
This application has no explicit mapping for /error
```

**This is GOOD!** It means Spring Boot is running! ✅

### Check Logs:
Railway dashboard → Your project → View logs

You should see:
```
Started ExpenseTrackerApplication in X seconds (JVM running for Y)
HikariPool-1 - Added connection
```

---

## 💰 Railway Pricing:

**Free Tier:**
- $5 credit per month
- Enough for your app
- No credit card required initially
- Backend sleeps after 30 min inactivity (wakes up on first request)

**Usage:**
- Your app uses ~$0.50-$2/month
- Well within free credits! ✅

---

## ✅ Final Test Checklist:

After Railway deployment:

- [ ] Backend deployed to Railway
- [ ] Backend URL copied
- [ ] `src/config.js` updated with Railway URL
- [ ] Frontend redeployed (`npm run deploy`)
- [ ] Test signup: https://klu2300030150.github.io/Expense_Tracker_Frontend/
- [ ] Create account - Should work! ✅
- [ ] Login - Should work! ✅
- [ ] Add expense - Should work! ✅
- [ ] **FULL APP RUNNING 24/7!** 🎉

---

## 🚀 Quick Start Commands:

After you get Railway URL, run these:

```powershell
cd "d:\D Drive\OneDrive - K L University\Desktop\EF2"

# Update config.js with your Railway URL first!
# Then:

git add src/config.js
git commit -m "Connect frontend to Railway backend"
git push
npm run deploy

# Wait 2 minutes, then test:
# https://klu2300030150.github.io/Expense_Tracker_Frontend/
```

---

## 🎯 Summary:

**Steps to 24/7 Backend:**
1. ✅ Go to https://railway.app/
2. ✅ Login with GitHub
3. ✅ Deploy `Expense_Tracker_backend` repo
4. ✅ Wait for build (2-3 min)
5. ✅ Generate domain / copy URL
6. ✅ Update `src/config.js` with URL
7. ✅ Redeploy frontend
8. ✅ **DONE! App running 24/7!** 🎉

---

**Ready?** Go to: https://railway.app/ and let's deploy! 🚀
