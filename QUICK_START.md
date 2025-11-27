# 🚀 Quick Start Guide - Updated with New Features

## ✅ Prerequisites Check

Before running, make sure you have:
- ✅ Java 17 or higher
- ✅ Maven
- ✅ Node.js 16 or higher
- ✅ MySQL running on port 3306

---

## 📦 Step 1: Install Frontend Dependencies

Open a PowerShell terminal and run:

```powershell
cd "d:\D Drive\OneDrive - K L University\Desktop\EF2"
npm install
```

This will install all the new dependencies including:
- Bootstrap 5
- React Toastify
- jsPDF
- Bootstrap Icons

---

## 🎯 Step 2: Start the Backend (Spring Boot)

### Option A: If backend is already running
Check if port 8080 is in use:
```powershell
netstat -ano | findstr :8080
```

If you see output, the backend is running! Skip to Step 3.

### Option B: Start backend
```powershell
cd "d:\D Drive\OneDrive - K L University\Desktop\EF2\backend"
mvn spring-boot:run
```

Wait until you see:
```
Started ExpenseTrackerApplication in X.XXX seconds
```

---

## 🎨 Step 3: Start the Frontend (Vite + React)

Open a **NEW** PowerShell terminal (keep backend running):

```powershell
cd "d:\D Drive\OneDrive - K L University\Desktop\EF2"
npm run dev
```

You should see:
```
VITE v5.4.20  ready in XXXXms

➜  Local:   http://localhost:5173/Expense_Tracker_Frontend/
```

**Important:** Keep this terminal open! Don't close it.

---

## 🌐 Step 4: Open in Browser

Open your browser and go to:
```
http://localhost:5173/Expense_Tracker_Frontend/
```

---

## 🎉 What to Expect

### New Features You'll See:

1. **Beautiful Login Page**
   - Gradient background
   - Animated card
   - Loading spinner
   - Bootstrap styling

2. **Toast Notifications**
   - Login success message
   - Appears at top-right
   - Auto-dismisses

3. **Enhanced Dashboard**
   - Category icons with colors
   - Export CSV button
   - Export PDF button
   - Better expense cards

4. **Improved Sidebar**
   - Bootstrap icons
   - User avatar
   - Email display
   - Smooth animations

5. **Modern Topbar**
   - Search bar
   - Theme toggle
   - User profile
   - Quick add button

---

## 🐛 Troubleshooting

### Frontend won't start?
```powershell
# Kill any process on port 5173
netstat -ano | findstr :5173
taskkill /F /PID <PID_NUMBER>

# Try again
npm run dev
```

### Backend won't start?
```powershell
# Kill any process on port 8080
netstat -ano | findstr :8080
taskkill /F /PID <PID_NUMBER>

# Start backend
cd backend
mvn spring-boot:run
```

### "ERR_CONNECTION_REFUSED"?
- Make sure both backend and frontend are running
- Check if ports 8080 and 5173 are listening
- Restart both servers

### Toast notifications not showing?
- Clear browser cache
- Hard refresh: Ctrl + Shift + R
- Check browser console for errors

---

## 🎨 Testing New Features

### 1. Test Toast Notifications
- Try to login with wrong password → See error toast
- Login successfully → See welcome toast
- Add an expense → See success toast
- Delete an expense → See delete toast

### 2. Test Export Features
- Go to Dashboard
- Add some expenses
- Click "Export CSV" → CSV file downloads
- Click "Export PDF" → PDF file downloads
- Open files to verify content

### 3. Test Bootstrap UI
- Notice the gradient background on login
- See Bootstrap icons in sidebar
- Try the theme toggle button
- Check mobile responsiveness (resize browser)

### 4. Test Category Icons
- Add expenses in different categories
- See different icons and colors for each
- Check the color-coded expense cards

---

## 📱 Mobile Testing

To test on mobile device:

1. Get your PC's IP address:
```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Start frontend with host flag:
```powershell
npm run dev -- --host
```

3. On mobile browser, go to:
```
http://YOUR_IP_ADDRESS:5173/Expense_Tracker_Frontend/
```

---

## 🎯 Quick Test Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Can access login page
- [ ] Can login successfully
- [ ] See welcome toast notification
- [ ] Dashboard loads with Bootstrap styling
- [ ] Sidebar shows Bootstrap icons
- [ ] Can add expenses with toast confirmation
- [ ] Can export to CSV
- [ ] Can export to PDF
- [ ] Theme toggle works
- [ ] Category icons display correctly
- [ ] Mobile view works (resize browser)

---

## 🔧 Common Commands

### Check if servers are running:
```powershell
netstat -ano | findstr "8080 5173"
```

### Stop all servers:
```powershell
# Stop backend
taskkill /F /PID <BACKEND_PID>

# Stop frontend  
# Just press Ctrl+C in the terminal
```

### Restart everything:
```powershell
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
npm run dev
```

---

## 💡 Pro Tips

1. **Keep both terminals visible** - Use split view in VS Code
2. **Use browser DevTools** - F12 to see console logs
3. **Check Network tab** - See API calls and responses
4. **Test error scenarios** - Try invalid inputs to see error handling
5. **Customize theme** - Change colors in CSS files
6. **Add more categories** - Edit Dashboard.jsx categories array

---

## 📞 Need Help?

If you encounter issues:
1. Check both terminal outputs for errors
2. Verify MySQL is running
3. Check backend logs for stack traces
4. Clear browser cache
5. Restart both servers
6. Check `config.js` for correct API URL

---

## 🎉 Success!

If you see:
- ✅ Beautiful gradient login page
- ✅ Bootstrap icons everywhere
- ✅ Toast notifications popping up
- ✅ Export buttons working
- ✅ Category colors and icons

**Congratulations! All new features are working! 🎊**

---

**Pro Tip:** Keep the frontend terminal open while working. It will hot-reload when you make changes to the code!

## 🌟 What's Next?

Check `NEW_FEATURES.md` for:
- Complete list of all new features
- Future feature roadmap
- Technical documentation
- Usage examples

Happy expense tracking! 💰✨
