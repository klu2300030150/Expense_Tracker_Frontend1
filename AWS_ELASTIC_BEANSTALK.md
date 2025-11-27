# AWS Elastic Beanstalk Deployment Guide

## Your Setup:
- **Frontend:** GitHub Pages
- **Backend:** AWS Elastic Beanstalk (Node.js)
- **Database:** AWS RDS MySQL (expensetrackerbackend.cxy4ogqqgubd.eu-north-1.rds.amazonaws.com)

---

## Step 1: Install EB CLI (One Time)

Open PowerShell as Administrator:
```powershell
pip install awsebcli
```

Or download from: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-windows.html

---

## Step 2: Configure AWS Credentials

```powershell
aws configure
```

Enter:
- AWS Access Key ID: (from AWS Console → IAM → Users → Security Credentials)
- AWS Secret Access Key: (same place)
- Default region: eu-north-1
- Output format: json

---

## Step 3: Initialize Elastic Beanstalk

```powershell
cd "c:\Users\sreek\OneDrive\Pictures\Camera Roll\Desktop\Expense_Tracker_Frontend-main (1)\Expense_Tracker_Frontend-main"

eb init
```

Choose:
1. Region: `eu-north-1` (Stockholm - same as your RDS)
2. Application name: `expense-tracker-backend`
3. Platform: `Node.js`
4. Node.js version: `Node.js 18`
5. SSH: `Yes` (create new keypair)

---

## Step 4: Create Environment

```powershell
eb create expense-tracker-env
```

Wait 5-10 minutes for deployment.

---

## Step 5: Set Environment Variables

```powershell
eb setenv MYSQL_HOST=expensetrackerbackend.cxy4ogqqgubd.eu-north-1.rds.amazonaws.com MYSQL_PORT=3306 MYSQL_USER=admin MYSQL_PASSWORD=Sreekar8297 MYSQL_DATABASE=ExpenseTrackerBackend
```

---

## Step 6: Get Your Backend URL

```powershell
eb status
```

Look for: `CNAME: expense-tracker-env.xxxxxx.eu-north-1.elasticbeanstalk.com`

Your backend URL: `http://expense-tracker-env.xxxxxx.eu-north-1.elasticbeanstalk.com`

---

## Step 7: Update Frontend Config

Update `src/config.js`:
```javascript
export const API_BASE_URL = 'http://expense-tracker-env.xxxxxx.eu-north-1.elasticbeanstalk.com';
```

Then push to GitHub Pages.

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `eb status` | Check environment status |
| `eb logs` | View application logs |
| `eb deploy` | Deploy new version |
| `eb open` | Open app in browser |
| `eb terminate` | Delete environment |

---

## Important: RDS Security Group

Make sure your RDS allows connections from Elastic Beanstalk:

1. Go to AWS RDS → ExpenseTrackerBackend → Security Group
2. Edit Inbound Rules
3. Add: MySQL/Aurora, Port 3306, Source: 0.0.0.0/0 (or EB security group)
