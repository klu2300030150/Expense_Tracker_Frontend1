# Ansible Deployment for Expense Tracker

This directory contains Ansible playbooks to automate the deployment of the Expense Tracker application on AWS EC2 instances.

## 📁 Structure

```
ansible/
├── inventory.ini           # Host inventory file
├── site.yml               # Main deployment playbook
├── group_vars/
│   └── all.yml            # Global variables
├── templates/
│   ├── env.j2             # Environment file template
│   └── nginx.conf.j2      # Nginx configuration template
├── playbooks/
│   ├── install-mysql.yml  # MySQL installation playbook
│   └── deploy-frontend.yml # Frontend deployment playbook
└── README.md              # This file
```

## 🚀 Prerequisites

1. **Install Ansible** on your local machine:
   ```bash
   # macOS
   brew install ansible
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install ansible
   
   # Windows (use WSL)
   sudo apt install ansible
   ```

2. **AWS EC2 Instance** running Amazon Linux 2:
   - Security Group with ports 22, 80, 443, 5000 open
   - SSH key pair (.pem file)

3. **AWS RDS MySQL** (optional - can use EC2-hosted MySQL):
   - Security Group allowing EC2 access

## ⚙️ Configuration

### 1. Update Inventory File

Edit `inventory.ini` with your EC2 public IP:

```ini
[webservers]
your-ec2-public-ip ansible_user=ec2-user ansible_ssh_private_key_file=~/.ssh/your-key.pem
```

### 2. Update Variables

Edit `group_vars/all.yml` with your settings:

```yaml
# MySQL/RDS Configuration
mysql_host: "your-rds-endpoint.amazonaws.com"
mysql_user: "admin"
mysql_password: "YourSecurePassword"
mysql_database: "expense_tracker"

# Application Settings
app_port: 5000
github_repo: "https://github.com/YOUR_USERNAME/YOUR_REPO.git"
```

## 📝 Available Playbooks

### Main Deployment (Backend)
```bash
# Deploy everything
ansible-playbook -i inventory.ini site.yml

# With verbose output
ansible-playbook -i inventory.ini site.yml -v

# Only specific tags
ansible-playbook -i inventory.ini site.yml --tags "deploy"
```

### MySQL Installation (if not using RDS)
```bash
ansible-playbook -i inventory.ini playbooks/install-mysql.yml
```

### Frontend Deployment (with Nginx)
```bash
ansible-playbook -i inventory.ini playbooks/deploy-frontend.yml
```

## 🏷️ Available Tags

Use tags to run specific parts:

| Tag | Description |
|-----|-------------|
| `system` | System updates and packages |
| `nodejs` | Node.js installation |
| `pm2` | PM2 setup and process management |
| `deploy` | Application deployment |
| `config` | Configuration files |
| `health` | Health checks |
| `status` | Show PM2 status |
| `nginx` | Nginx configuration |
| `build` | Frontend build |
| `firewall` | Firewall rules |

Example:
```bash
# Only deploy application code
ansible-playbook -i inventory.ini site.yml --tags "deploy"

# Install Node.js and PM2 only
ansible-playbook -i inventory.ini site.yml --tags "nodejs,pm2"
```

## 🔧 Quick Start

### Full Deployment (5 minutes)

```bash
# 1. Clone the repo locally
git clone https://github.com/klu2300030150/Expense_Tracker_Frontend1.git
cd Expense_Tracker_Frontend1/ansible

# 2. Update inventory.ini with your EC2 IP

# 3. Update group_vars/all.yml with your settings

# 4. Test connection
ansible -i inventory.ini webservers -m ping

# 5. Run the deployment
ansible-playbook -i inventory.ini site.yml
```

### Expected Output

```
PLAY [Deploy Expense Tracker Application] **************************************

TASK [Update system packages] **************************************************
changed: [your-ec2-ip]

TASK [Install Node.js] *********************************************************
changed: [your-ec2-ip]

TASK [Clone application repository] ********************************************
changed: [your-ec2-ip]

TASK [Start application with PM2] **********************************************
changed: [your-ec2-ip]

TASK [Check application health] ************************************************
ok: [your-ec2-ip]

PLAY RECAP *********************************************************************
your-ec2-ip    : ok=15   changed=10   unreachable=0   failed=0   skipped=0
```

## 🔄 Redeployment

To update the application after code changes:

```bash
# Pull latest code and restart
ansible-playbook -i inventory.ini site.yml --tags "deploy,pm2"
```

## 🐛 Troubleshooting

### Connection Failed
```bash
# Check SSH access manually
ssh -i ~/.ssh/your-key.pem ec2-user@your-ec2-ip

# Check Ansible connection
ansible -i inventory.ini webservers -m ping -vvv
```

### Permission Denied
```bash
# Fix key permissions
chmod 400 ~/.ssh/your-key.pem
```

### Application Not Starting
```bash
# Check PM2 logs on EC2
ssh -i ~/.ssh/your-key.pem ec2-user@your-ec2-ip
pm2 logs expense-backend
```

### Health Check Failed
```bash
# Check if app is running
curl http://your-ec2-ip:5000/api/health
```

## 📊 Verification

After deployment, verify:

1. **Health Check**: `http://your-ec2-ip:5000/api/health`
2. **Frontend**: `http://your-ec2-ip` (after deploy-frontend.yml)
3. **PM2 Status**: SSH in and run `pm2 status`

## 📌 Notes

- Default Node.js version: 18.x
- Default app port: 5000
- PM2 is configured for auto-restart
- Logs available via `pm2 logs`

## 🔐 Security Recommendations

1. Change default passwords in `group_vars/all.yml`
2. Use AWS Secrets Manager for sensitive data
3. Enable HTTPS with Let's Encrypt
4. Restrict security group rules
5. Use Ansible Vault for encrypted variables:
   ```bash
   ansible-vault encrypt group_vars/all.yml
   ```
