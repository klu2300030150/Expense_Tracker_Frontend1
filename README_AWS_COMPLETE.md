# 🚀 Complete AWS Deployment Guide - Expense Tracker

This guide will help you deploy the entire Expense Tracker application on AWS with:
- **AWS RDS** - MySQL Database
- **AWS EC2** - Backend Server
- **AWS S3 + CloudFront** - Frontend Hosting (or GitHub Pages)

---

## 📋 Prerequisites

1. **AWS Account**: https://aws.amazon.com (Free tier available)
2. **Credit Card**: Required for AWS signup (won't be charged for free tier)
3. **Your GitHub repo**: https://github.com/klu2300030150/Expense_Tracker_Frontend1

---

## 💰 Cost Estimate

| Service | Free Tier (12 months) | After Free Tier |
|---------|----------------------|-----------------|
| RDS MySQL (db.t3.micro) | 750 hours/month FREE | ~$15/month |
| EC2 (t2.micro) | 750 hours/month FREE | ~$8/month |
| S3 + CloudFront | 5GB FREE | ~$1/month |
| **Total** | **FREE** | **~$24/month** |

---

## 🗄️ PART 1: Create RDS MySQL Database

### Step 1.1: Open RDS Console
1. Go to **https://console.aws.amazon.com**
2. Sign in to your AWS account
3. Search for **"RDS"** in the search bar
4. Click on **RDS** to open the dashboard

### Step 1.2: Create Database
1. Click **"Create database"** button
2. Select the following options:

#### Database Creation Method
- ✅ **Standard create**

#### Engine Options
- **Engine type**: MySQL
- **Version**: MySQL 8.0.35 (or latest 8.0.x)

#### Templates
- ✅ **Free tier** (IMPORTANT!)

#### Settings
- **DB instance identifier**: `expense-tracker-db`
- **Master username**: `admin`
- **Master password**: `Sreekar8297` (or your own strong password)
- **Confirm password**: `Sreekar8297`

#### Instance Configuration
- **DB instance class**: `db.t3.micro` (Free tier eligible)

#### Storage
- **Storage type**: General Purpose SSD (gp2)
- **Allocated storage**: `20` GB
- ❌ **Uncheck** "Enable storage autoscaling"

#### Connectivity
- **Compute resource**: Don't connect to an EC2 compute resource
- **Network type**: IPv4
- **Virtual private cloud (VPC)**: Default VPC
- **DB subnet group**: default
- **Public access**: ✅ **Yes** (Important for initial setup)
- **VPC security group**: **Create new**
- **New VPC security group name**: `expense-tracker-db-sg`
- **Availability Zone**: No preference

#### Database Authentication
- ✅ **Password authentication**

#### Additional Configuration (Click to expand)
- **Initial database name**: `expense_tracker`
- ❌ **Uncheck** "Enable automated backups" (to stay in free tier)
- ❌ **Uncheck** "Enable encryption"

### Step 1.3: Create Database
1. Click **"Create database"** button at the bottom
2. ⏳ Wait 5-10 minutes for database to be created
3. Status will change from "Creating" to "Available"

### Step 1.4: Get Database Endpoint
1. Click on your database name `expense-tracker-db`
2. Find **"Endpoint & port"** section
3. Copy the **Endpoint** (looks like: `expense-tracker-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`)
4. Note the **Port**: `3306`

### Step 1.5: Configure Security Group
1. In the database details, click on the **VPC security group** link
2. Click on the security group ID
3. Click **"Edit inbound rules"**
4. Add rule:
   - **Type**: MySQL/Aurora
   - **Port**: 3306
   - **Source**: Anywhere-IPv4 (0.0.0.0/0)
5. Click **"Save rules"**

### ✅ RDS Setup Complete!
Save these details:
```
MYSQL_HOST=expense-tracker-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD=Sreekar8297
MYSQL_DATABASE=expense_tracker
```

---

## 🖥️ PART 2: Create EC2 Instance for Backend

### Step 2.1: Open EC2 Console
1. Go to **https://console.aws.amazon.com/ec2**
2. Click **"Launch instance"**

### Step 2.2: Configure Instance

#### Name and Tags
- **Name**: `expense-tracker-backend`

#### Application and OS Images
- Click **"Amazon Linux"**
- Select **"Amazon Linux 2023 AMI"** (Free tier eligible)
- Architecture: **64-bit (x86)**

#### Instance Type
- Select **`t2.micro`** (Free tier eligible)

#### Key Pair (Login)
1. Click **"Create new key pair"**
2. **Key pair name**: `expense-tracker-key`
3. **Key pair type**: RSA
4. **Private key file format**: `.pem`
5. Click **"Create key pair"**
6. ⚠️ **SAVE THE DOWNLOADED .pem FILE** - You need this to connect!

#### Network Settings
1. Click **"Edit"**
2. **Auto-assign public IP**: Enable
3. **Firewall (security groups)**: Create security group
4. **Security group name**: `expense-tracker-backend-sg`
5. Add rules:

| Type | Port | Source | Description |
|------|------|--------|-------------|
| SSH | 22 | My IP | SSH access |
| Custom TCP | 5000 | Anywhere (0.0.0.0/0) | Backend API |
| HTTP | 80 | Anywhere (0.0.0.0/0) | Web access |
| HTTPS | 443 | Anywhere (0.0.0.0/0) | Secure web |

#### Configure Storage
- **Size**: `8` GiB (default is fine)

### Step 2.3: Launch Instance
1. Click **"Launch instance"**
2. Click **"View all instances"**
3. Wait for **Instance state** to be `Running`
4. Wait for **Status check** to be `2/2 checks passed`

### Step 2.4: Get Public IP
1. Click on your instance `expense-tracker-backend`
2. Copy the **Public IPv4 address** (e.g., `54.123.456.789`)

### ✅ EC2 Setup Complete!
Save these details:
```
EC2_PUBLIC_IP=54.123.456.789
KEY_FILE=expense-tracker-key.pem
```

---

## 🔧 PART 3: Deploy Backend to EC2

### Step 3.1: Connect to EC2 (Windows PowerShell)

```powershell
# Navigate to folder where you saved the .pem file
cd C:\Users\YourUsername\Downloads

# Set permissions (Windows)
icacls expense-tracker-key.pem /inheritance:r /grant:r "$($env:USERNAME):R"

# Connect to EC2
ssh -i expense-tracker-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

### Step 3.2: Install Node.js on EC2

Run these commands after connecting:

```bash
# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version

# Install git
sudo yum install -y git

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 3.3: Clone and Setup Project

```bash
# Clone your repository
git clone https://github.com/klu2300030150/Expense_Tracker_Frontend1.git

# Navigate to project
cd Expense_Tracker_Frontend1

# Install dependencies
npm install
```

### Step 3.4: Create Environment File

```bash
# Create .env file
nano .env
```

Paste this content (replace with YOUR values):
```
MYSQL_HOST=expense-tracker-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD=Sreekar8297
MYSQL_DATABASE=expense_tracker
PORT=5000
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### Step 3.5: Update Server.js to Use .env

```bash
# Check if dotenv is in package.json, if not:
npm install dotenv
```

### Step 3.6: Start Backend Server

```bash
# Start with PM2
pm2 start server.js --name expense-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Check status
pm2 status
```

### Step 3.7: Test Backend

```bash
# Test locally on EC2
curl http://localhost:5000/api/health
```

From your PC browser, visit:
```
http://YOUR_EC2_PUBLIC_IP:5000/api/health
```

You should see: `{"status":"ok","database":"connected"}`

### ✅ Backend Deployment Complete!

---

## 🌐 PART 4: Update Frontend & Deploy to GitHub Pages

### Step 4.1: Update Frontend Config (On Your PC)

Edit `src/config.js`:
```javascript
// API Configuration - AWS Backend
const API_BASE_URL = 'http://YOUR_EC2_PUBLIC_IP:5000';

export default API_BASE_URL;
```

### Step 4.2: Update Vite Config for GitHub Pages

Edit `vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Expense_Tracker_Frontend1/',
  server: {
    port: 5173
  }
});
```

### Step 4.3: Build and Deploy

```powershell
# Build frontend
npm run build

# Copy index.html to 404.html for SPA routing
Copy-Item dist/index.html dist/404.html

# Deploy to GitHub Pages
npx gh-pages -d dist

# Push changes to main
git add -A
git commit -m "Update API URL to AWS backend"
git push origin main
```

### Step 4.4: Test GitHub Pages

Visit: `https://klu2300030150.github.io/Expense_Tracker_Frontend1/`

---

## 🔒 PART 5: Security Best Practices (Optional but Recommended)

### 5.1: Use HTTPS with Let's Encrypt

On EC2:
```bash
# Install certbot
sudo yum install -y certbot

# Get SSL certificate (you need a domain name)
sudo certbot certonly --standalone -d yourdomain.com
```

### 5.2: Use Nginx as Reverse Proxy

```bash
# Install nginx
sudo yum install -y nginx

# Configure nginx
sudo nano /etc/nginx/conf.d/expense-tracker.conf
```

Add:
```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5.3: Restrict RDS Access

1. Go to RDS security group
2. Change inbound rule for MySQL from `0.0.0.0/0` to your EC2's **Private IP**

---

## 📊 PART 6: Monitoring & Maintenance

### View Backend Logs
```bash
# SSH to EC2
pm2 logs expense-backend

# View last 100 lines
pm2 logs expense-backend --lines 100
```

### Restart Backend
```bash
pm2 restart expense-backend
```

### Update Code
```bash
cd Expense_Tracker_Frontend1
git pull origin main
npm install
pm2 restart expense-backend
```

### Monitor RDS
- Go to RDS Console → Your database → Monitoring tab

### Monitor EC2
- Go to EC2 Console → Your instance → Monitoring tab

---

## 🆘 Troubleshooting

### Error: Cannot connect to RDS
1. Check security group allows port 3306
2. Verify RDS is "Available"
3. Check endpoint is correct
4. Verify password is correct

### Error: Backend not responding
```bash
# Check if running
pm2 status

# Check logs
pm2 logs expense-backend

# Restart
pm2 restart expense-backend
```

### Error: GitHub Pages shows white page
1. Check browser console for errors
2. Verify API_BASE_URL is correct
3. Check EC2 security group allows port 5000
4. Test backend directly: `http://EC2_IP:5000/api/health`

### Error: CORS issues
Backend should have CORS enabled (already configured in server.js)

---

## 📝 Summary - All Your Endpoints

| Component | URL |
|-----------|-----|
| **Frontend (GitHub Pages)** | https://klu2300030150.github.io/Expense_Tracker_Frontend1/ |
| **Backend API (EC2)** | http://YOUR_EC2_IP:5000 |
| **Backend Health Check** | http://YOUR_EC2_IP:5000/api/health |
| **MySQL Database (RDS)** | expense-tracker-db.xxxxx.rds.amazonaws.com:3306 |

---

## 🎉 Congratulations!

Your Expense Tracker is now fully deployed on AWS!

- ✅ MySQL Database on RDS
- ✅ Backend API on EC2  
- ✅ Frontend on GitHub Pages

---

## 📞 Support

If you have issues:
1. Check AWS CloudWatch logs
2. Check PM2 logs on EC2
3. Verify security group rules
4. Test each component individually

---

**Created for Expense Tracker Project**
**GitHub**: https://github.com/klu2300030150/Expense_Tracker_Frontend1
