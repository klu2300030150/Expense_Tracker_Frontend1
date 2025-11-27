#!/bin/bash

# Ansible Deployment Script for Expense Tracker
# Run this from a Linux/Mac machine

echo "============================================"
echo "  Ansible Deployment for Expense Tracker"
echo "============================================"
echo ""

# Change to ansible directory
cd "$(dirname "$0")"

# Check if Ansible is installed
if ! command -v ansible &> /dev/null; then
    echo "Ansible is not installed. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ansible
    elif [[ -f /etc/debian_version ]]; then
        sudo apt update && sudo apt install -y ansible
    elif [[ -f /etc/redhat-release ]]; then
        sudo yum install -y ansible
    else
        echo "Please install Ansible manually"
        exit 1
    fi
fi

echo "Ansible version: $(ansible --version | head -1)"
echo ""

# Check if inventory file exists
if [ ! -f "inventory.ini" ]; then
    echo "ERROR: inventory.ini not found!"
    exit 1
fi

# Test connection
echo "Testing connection to servers..."
ansible -i inventory.ini webservers -m ping

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Cannot connect to servers!"
    echo "Please check:"
    echo "  1. EC2 IP address in inventory.ini"
    echo "  2. SSH key path and permissions"
    echo "  3. Security Group allows SSH (port 22)"
    exit 1
fi

echo ""
echo "Connection successful!"
echo ""

# Run deployment
echo "Starting deployment..."
echo ""

ansible-playbook -i inventory.ini site.yml

if [ $? -eq 0 ]; then
    echo ""
    echo "============================================"
    echo "  Deployment Complete!"
    echo "============================================"
    echo ""
    echo "Your application is now running!"
    echo "Check: http://YOUR-EC2-IP:5000/api/health"
else
    echo ""
    echo "============================================"
    echo "  Deployment Failed!"
    echo "============================================"
    echo ""
    echo "Check the error messages above"
fi
