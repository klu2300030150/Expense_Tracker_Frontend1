# 🎯 Deploy Spring Boot to Render.com - Simple Method (No YAML Needed!)

## ❌ Problem: "No render.yaml found"

You're trying to use "Blueprint" which needs a `render.yaml` file. 
**We'll use the simpler "Web Service" method instead!**

---

## ✅ Simple Deployment Method (5 Minutes):

### Step 1: Go Back
- Click **"Cancel"** or **"Back"** on the Blueprint page
- Go back to Render dashboard

### Step 2: Create Web Service (Not Blueprint!)
1. Click **"New +"** button (top right)
2. Select **"Web Service"** (NOT Blueprint!)
3. Click **"Build and deploy from a Git repository"**
4. Click **"Connect"** next to your `Expense_Tracker_backend` repository

### Step 3: Configure Your Service
Fill in these settings:

**Basic Info:**
```
Name: expense-tracker-backend
Region: Choose closest to you (e.g., Oregon (US West))
Branch: main
Root Directory: (leave empty)
```

**Build Settings:**
```
Runtime: Docker

OR if Docker not available, choose:
Runtime: Java
Build Command: ./mvnw clean install -DskipTests
Start Command: java -Dserver.port=$PORT -jar target/expense-tracker-1.0.0.jar
```

**Instance Type:**
```
Free (512 MB RAM, 0.1 CPU)
```

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

| Key | Value |
|-----|-------|
| `PORT` | `8080` |
| `DATABASE_URL` | `jdbc:mysql://tramway.proxy.rlwy.net:14634/railway?useSSL=false&allowPublicKeyRetrieval=true` |
| `DB_USERNAME` | `root` |
| `DB_PASSWORD` | `FAuqyBgOVquUtJBPKbWBcPqgjkBNisLf` |
| `JWT_SECRET` | `YourSuperSecretKeyForJWTTokenGenerationMustBeLongEnough123456789` |
| `CORS_ORIGINS` | `https://klu2300030150.github.io` |

### Step 5: Create Web Service
- Click **"Create Web Service"** button
- Wait 5-10 minutes for deployment
- Render will build and deploy your Spring Boot app

### Step 6: Get Your URL
After deployment completes:
- You'll see your URL: `https://expense-tracker-backend.onrender.com`
- Copy this URL!

---

## 🐛 If Build Command Doesn't Work:

### Update Your pom.xml First:

Make sure your `pom.xml` has this in the `<build>` section:

```xml
<build>
    <finalName>expense-tracker</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

Then use this Start Command:
```
java -Dserver.port=$PORT -jar target/expense-tracker.jar
```

---

## 📋 Alternative: Create render.yaml (Optional)

If you want to use Blueprint later, I can create the file:

```yaml
# Create this file: render.yaml (in backend root)
services:
  - type: web
    name: expense-tracker-backend
    runtime: java
    buildCommand: ./mvnw clean install -DskipTests
    startCommand: java -Dserver.port=$PORT -jar target/expense-tracker-1.0.0.jar
    envVars:
      - key: DATABASE_URL
        value: jdbc:mysql://tramway.proxy.rlwy.net:14634/railway?useSSL=false&allowPublicKeyRetrieval=true
      - key: DB_USERNAME
        value: root
      - key: DB_PASSWORD
        value: FAuqyBgOVquUtJBPKbWBcPqgjkBNisLf
      - key: JWT_SECRET
        value: YourSuperSecretKeyForJWTTokenGenerationMustBeLongEnough123456789
      - key: CORS_ORIGINS
        value: https://klu2300030150.github.io
```

But **Web Service method is easier!** No file needed! ✅

---

## 🎯 Quick Steps Summary:

1. ❌ Cancel the Blueprint page
2. ✅ Click **"New +"** → **"Web Service"**
3. ✅ Connect GitHub repository
4. ✅ Fill in settings (see Step 3 above)
5. ✅ Add environment variables (see Step 4 above)
6. ✅ Click **"Create Web Service"**
7. ⏰ Wait 5-10 minutes
8. 🎉 Get your URL and test!

---

## 🧪 Test After Deployment:

```powershell
# Replace with your actual Render URL
$url = "https://expense-tracker-backend.onrender.com/api/auth/signup"
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    password = "test123"
    phoneNumber = "1234567890"
    currency = "USD"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json"
```

Should return:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "fullName": "Test User",
  "email": "test@example.com",
  "currency": "USD"
}
```

---

## ⚠️ Important Notes:

### Free Tier Limitations:
- Render Free tier **spins down** after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds (cold start)
- Good for testing/learning, not production

### Maven Wrapper:
If `./mvnw` doesn't work, use:
```
Build Command: mvn clean install -DskipTests
```

### Java Version:
Render uses Java 17 by default (which matches your project) ✅

---

## 🚀 After Deployment Success:

### Update Frontend:
```powershell
cd "d:\D Drive\OneDrive - K L University\Desktop\EF2"

# Edit src/config.js - update this line:
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://expense-tracker-backend.onrender.com'  # Your Render URL
  : 'http://localhost:8081';

# Deploy
git add src/config.js
git commit -m "Connect to Render backend"
git push
npm run deploy
```

Wait 2 minutes, then test:
https://klu2300030150.github.io/Expense_Tracker_Frontend/

---

## 📊 What to Expect:

### Build Time:
- First deployment: 5-10 minutes
- Render downloads dependencies
- Compiles Java code
- Creates JAR file
- Starts Spring Boot

### Logs to Watch:
```
Building...
[INFO] Scanning for projects...
[INFO] Building Expense Tracker Backend
[INFO] BUILD SUCCESS
Starting application...
Started ExpenseTrackerApplication in X seconds
```

When you see "Started ExpenseTrackerApplication" → Deployment successful! ✅

---

## 🎯 Current Status:

**What to do RIGHT NOW:**

1. **Cancel** the Blueprint page (click Back)
2. Click **"New +"** (top right)
3. Select **"Web Service"**
4. Choose your repository
5. Fill settings (copy from Step 3 above)
6. Add environment variables (copy from Step 4 above)
7. Click **"Create Web Service"**
8. Wait and watch logs!

**Blueprint (with render.yaml) is optional - Web Service is easier!** ✅

---

Need help with any step? Let me know! 🚀
