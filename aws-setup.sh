#!/bin/bash
# AWS EC2 Setup Script for Expense Tracker Backend
# Run this after SSH into EC2 instance

echo "=========================================="
echo "Expense Tracker - AWS EC2 Setup"
echo "=========================================="

# Update system
echo "Updating system..."
sudo yum update -y

# Install Node.js 18
echo "Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install git
echo "Installing git..."
sudo yum install -y git

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Clone repository
echo "Cloning repository..."
git clone https://github.com/klu2300030150/Expense_Tracker_Frontend1.git
cd Expense_Tracker_Frontend1

# Install dependencies
echo "Installing dependencies..."
npm install

# Create environment file
echo "Creating .env file..."
cat > .env << EOF
MYSQL_HOST=${MYSQL_HOST:-your-rds-endpoint.rds.amazonaws.com}
MYSQL_PORT=${MYSQL_PORT:-3306}
MYSQL_USER=${MYSQL_USER:-admin}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-Sreekar8297}
MYSQL_DATABASE=${MYSQL_DATABASE:-expense_tracker}
PORT=5000
EOF

echo ""
echo "=========================================="
echo "IMPORTANT: Edit .env file with your RDS credentials"
echo "nano .env"
echo "=========================================="
echo ""

# Start server with PM2
echo "Starting server..."
pm2 start server.js --name expense-backend
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo "Backend running on port 5000"
echo ""
echo "Commands:"
echo "  pm2 status          - Check status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart server"
echo ""
