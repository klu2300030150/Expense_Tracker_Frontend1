# AWS Deployment Guide for Expense Tracker

## Prerequisites
1. AWS Account (https://aws.amazon.com)
2. AWS CLI installed
3. Your MySQL credentials ready

---

## Step 1: Create RDS MySQL Database

### Via AWS Console:
1. Go to **AWS Console** → **RDS** → **Create Database**
2. Choose:
   - **Engine**: MySQL 8.0
   - **Template**: Free tier
   - **DB Instance Identifier**: `expense-tracker-db`
   - **Master Username**: `admin`
   - **Master Password**: `Sreekar8297` (choose your own)
   - **DB Instance Class**: `db.t3.micro` (free tier)
   - **Storage**: 20 GB
   - **Public Access**: Yes (for now, secure later)
   - **VPC Security Group**: Create new, allow port 3306
3. Click **Create Database**
4. Wait 5-10 minutes for creation
5. Note the **Endpoint** (e.g., `expense-tracker-db.xxxxx.us-east-1.rds.amazonaws.com`)

### Via AWS CLI:
```bash
# Create security group
aws ec2 create-security-group --group-name expense-tracker-sg --description "Expense Tracker Security Group"

# Allow MySQL access
aws ec2 authorize-security-group-ingress --group-name expense-tracker-sg --protocol tcp --port 3306 --cidr 0.0.0.0/0

# Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier expense-tracker-db \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --engine-version 8.0 \
    --master-username admin \
    --master-user-password Sreekar8297 \
    --allocated-storage 20 \
    --publicly-accessible \
    --db-name expense_tracker
```

---

## Step 2: Create EC2 Instance for Backend

### Via AWS Console:
1. Go to **EC2** → **Launch Instance**
2. Choose:
   - **Name**: `expense-tracker-backend`
   - **AMI**: Amazon Linux 2023
   - **Instance Type**: `t2.micro` (free tier)
   - **Key Pair**: Create new or use existing
   - **Security Group**: Allow ports 22 (SSH), 5000 (API), 80 (HTTP)
3. Click **Launch Instance**
4. Note the **Public IP**

---

## Step 3: Deploy Backend to EC2

SSH into your EC2 instance:
```bash
ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>
```

Install Node.js and clone repo:
```bash
# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install git
sudo yum install -y git

# Clone your repo
git clone https://github.com/klu2300030150/Expense_Tracker_Frontend1.git
cd Expense_Tracker_Frontend1

# Install dependencies
npm install

# Set environment variables
export MYSQL_HOST=<YOUR_RDS_ENDPOINT>
export MYSQL_PORT=3306
export MYSQL_USER=admin
export MYSQL_PASSWORD=Sreekar8297
export MYSQL_DATABASE=expense_tracker
export PORT=5000

# Start server with PM2 (process manager)
sudo npm install -g pm2
pm2 start server.js --name expense-backend
pm2 save
pm2 startup
```

---

## Step 4: Update Frontend Config

Update `src/config.js` with your EC2 public IP:
```javascript
const API_BASE_URL = 'http://<EC2_PUBLIC_IP>:5000';
```

---

## Step 5: Rebuild and Deploy Frontend to GitHub Pages

```bash
npm run build
npx gh-pages -d dist
```

---

## Environment Variables for Backend

| Variable | Value |
|----------|-------|
| MYSQL_HOST | `<RDS_ENDPOINT>.rds.amazonaws.com` |
| MYSQL_PORT | `3306` |
| MYSQL_USER | `admin` |
| MYSQL_PASSWORD | `Sreekar8297` |
| MYSQL_DATABASE | `expense_tracker` |
| PORT | `5000` |

---

## Cost Estimate (Free Tier - 12 months)
- **RDS db.t3.micro**: Free (750 hours/month)
- **EC2 t2.micro**: Free (750 hours/month)
- **Storage**: 20GB free

After free tier: ~$15-25/month

---

## Security Recommendations
1. Use VPC and private subnets
2. Use Secrets Manager for credentials
3. Enable SSL/TLS
4. Restrict security group IPs
5. Use IAM roles instead of access keys
