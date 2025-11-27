# Railway MySQL Automation Script
# Run: .\scripts\setup-db.ps1 [command]
# Commands: test, tables, seed, query "SQL", all

param(
    [Parameter(Position=0)]
    [string]$Command = "test",
    [Parameter(Position=1, ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

# Load .env file
$envFile = Join-Path $PSScriptRoot "..\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "✓ Loaded environment from .env" -ForegroundColor Green
} else {
    Write-Host "✗ .env file not found!" -ForegroundColor Red
    exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir

Push-Location $rootDir

switch ($Command.ToLower()) {
    "test" {
        Write-Host "`n🔌 Testing Railway MySQL connection..." -ForegroundColor Cyan
        npm.cmd run db:test
    }
    "tables" {
        Write-Host "`n📋 Listing database tables..." -ForegroundColor Cyan
        npm.cmd run db:query -- "SHOW TABLES"
    }
    "schema" {
        Write-Host "`n📊 Showing full schema..." -ForegroundColor Cyan
        npm.cmd run db:query -- "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME, ORDINAL_POSITION"
    }
    "seed" {
        Write-Host "`n🌱 Running seed file..." -ForegroundColor Cyan
        npm.cmd run db:file -- "./scripts/seed.sql"
    }
    "query" {
        if ($Args.Count -gt 0) {
            $sql = $Args -join " "
            Write-Host "`n🔍 Running query: $sql" -ForegroundColor Cyan
            npm.cmd run db:query -- $sql
        } else {
            Write-Host "Usage: .\setup-db.ps1 query ""SELECT * FROM users""" -ForegroundColor Yellow
        }
    }
    "backup" {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupFile = "backup_$timestamp.sql"
        Write-Host "`n💾 Creating backup: $backupFile" -ForegroundColor Cyan
        npm.cmd run db:query -- "SELECT CONCAT('-- Backup created: ', NOW()) AS info" | Out-File $backupFile
        # Note: Full mysqldump requires mysql client; this exports table structure
        npm.cmd run db:query -- "SHOW CREATE TABLE users" >> $backupFile 2>$null
        npm.cmd run db:query -- "SHOW CREATE TABLE expenses" >> $backupFile 2>$null
        npm.cmd run db:query -- "SHOW CREATE TABLE budgets" >> $backupFile 2>$null
        Write-Host "✓ Backup saved to $backupFile" -ForegroundColor Green
    }
    "all" {
        Write-Host "`n🚀 Running full setup..." -ForegroundColor Cyan
        Write-Host "`n[1/4] Testing connection..." -ForegroundColor Yellow
        npm.cmd run db:test
        Write-Host "`n[2/4] Creating tables..." -ForegroundColor Yellow
        npm.cmd run db:file -- "./scripts/seed.sql"
        Write-Host "`n[3/4] Verifying tables..." -ForegroundColor Yellow
        npm.cmd run db:query -- "SHOW TABLES"
        Write-Host "`n[4/4] Done!" -ForegroundColor Green
        Write-Host "`n✅ Database fully configured and ready!" -ForegroundColor Green
    }
    default {
        Write-Host @"
Railway MySQL Automation Script
================================
Usage: .\scripts\setup-db.ps1 [command]

Commands:
  test      Test database connection
  tables    List all tables
  schema    Show full database schema
  seed      Run seed.sql to create/update tables
  query     Run a custom SQL query
  backup    Export table structures
  all       Run full setup (test + seed + verify)

Examples:
  .\scripts\setup-db.ps1 test
  .\scripts\setup-db.ps1 query "SELECT * FROM users LIMIT 5"
  .\scripts\setup-db.ps1 all
"@ -ForegroundColor Cyan
    }
}

Pop-Location
