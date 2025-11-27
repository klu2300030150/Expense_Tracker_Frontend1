# GitHub Pages Deployment Guide - FIXED ✅

## Issues Fixed:

### 1. White Page Issue
**Cause**: GitHub Pages serves from subdirectory, React Router couldn't find routes

**Fixed with**:
- ✅ Added `base: '/Expense_Tracker_Frontend/'` in `vite.config.js`
- ✅ Added `basename="/Expense_Tracker_Frontend"` in `BrowserRouter` (App.jsx)
- ✅ Added 404.html for client-side routing
- ✅ Added SPA redirect script in index.html

### 2. API Configuration
**Fixed with**:
- ✅ Created `src/config.js` for centralized API URL management
- ✅ Auto-detects local dev vs production
- ✅ Updated all pages (Login, Signup, Dashboard) to use `API_BASE_URL`

---

## Important: Backend Cannot Run on GitHub Pages! ⚠️

**GitHub Pages only hosts static files (HTML, CSS, JS)**
- ❌ Cannot run Spring Boot (Java server)
- ❌ Cannot connect to MySQL
- ❌ Cannot run any backend code

**Your Backend Options:**

### Option 1: Railway (Recommended - FREE) ✅
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: `Expense_Tracker_backend`
5. Railway auto-detects Spring Boot
6. Add environment variables:
   - `PORT`: 8080
   - `DATABASE_URL`: (auto-filled from Railway MySQL)
   - `JWT_SECRET`: YourSuperSecretKeyForJWTTokenGenerationMustBeLongEnough123456789
7. Deploy! You'll get URL like: `https://expense-tracker-backend-production.up.railway.app`

### Option 2: Render.com (FREE)
1. Go to https://render.com
2. New Web Service → Connect GitHub repo: `Expense_Tracker_backend`
3. Build Command: `mvn clean install`
4. Start Command: `java -jar target/expense-tracker-1.0.0.jar`

---

## Deployment Steps:

### Step 1: Update Backend URL in config.js
```javascript
// src/config.js
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://YOUR-RAILWAY-URL.up.railway.app'  // ← Update this!
  : 'http://localhost:8081';
```

### Step 2: Build and Deploy Frontend
```bash
cd "d:\D Drive\OneDrive - K L University\Desktop\EF2"

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

This will:
1. Build your React app to `dist/` folder
2. Push the `dist/` folder to `gh-pages` branch
3. GitHub Pages will serve from that branch

### Step 3: Configure GitHub Pages
1. Go to: https://github.com/klu2300030150/Expense_Tracker_Frontend/settings/pages
2. Source: Deploy from branch
3. Branch: `gh-pages` → `/root`
4. Save

### Step 4: Access Your App
- Frontend: https://klu2300030150.github.io/Expense_Tracker_Frontend/
- Backend: (Deploy to Railway first!)

---

## Testing Locally After Changes:

```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
cd ..
npm run dev
```

Visit: http://localhost:5173

---

## Troubleshooting:

### White page still showing?
1. Check browser console (F12)
2. Look for 404 errors
3. Verify `base` in vite.config.js matches repo name
4. Hard refresh: Ctrl + Shift + R

### API errors after deployment?
1. Check if backend is deployed to Railway
2. Update `src/config.js` with correct Railway URL
3. Rebuild and redeploy: `npm run deploy`

### CORS errors?
Update `application.properties` in backend:
```properties
spring.web.cors.allowed-origins=https://klu2300030150.github.io
```

---

## Current Status:
- ✅ Frontend: Ready to deploy
- ⚠️ Backend: Needs Railway deployment
- ✅ MySQL: Connected to Railway cloud
- ✅ White page: FIXED
- ✅ Routing: FIXED

---

## Next Steps:
1. Deploy backend to Railway (5 minutes)
2. Copy Railway URL
3. Update `src/config.js` with Railway URL
4. Run `npm run deploy`
5. Visit: https://klu2300030150.github.io/Expense_Tracker_Frontend/

**Your app will be live 24/7!** 🎉
