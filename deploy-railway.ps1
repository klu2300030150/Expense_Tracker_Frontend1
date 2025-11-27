#!/usr/bin/env pwsh
# Quick Railway Deployment Script

Write-Host "🚀 Railway Backend Deployment" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Login to Railway
Write-Host "Step 1: Login to Railway" -ForegroundColor Yellow
Write-Host "This will open your browser to authenticate...`n" -ForegroundColor Gray
railway login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login failed. Please try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Logged in successfully!`n" -ForegroundColor Green

# Step 2: Initialize Railway project
Write-Host "Step 2: Initialize Railway Project" -ForegroundColor Yellow
railway init

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Project initialization failed." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project initialized!`n" -ForegroundColor Green

# Step 3: Set environment variable
Write-Host "Step 3: Configure Database" -ForegroundColor Yellow
$dbUrl = "mysql://root:jsMCBLUiFOYHjkIHwrjZKlSPTDhmtJDd@gondola.proxy.rlwy.net:47595/railway"
railway variables set DATABASE_URL="$dbUrl"

Write-Host "✅ Database configured!`n" -ForegroundColor Green

# Step 4: Deploy
Write-Host "Step 4: Deploy to Railway" -ForegroundColor Yellow
Write-Host "This will build and deploy your backend...`n" -ForegroundColor Gray
railway up

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deployment successful!`n" -ForegroundColor Green

# Step 5: Get the domain
Write-Host "Step 5: Get Your Backend URL" -ForegroundColor Yellow
Write-Host "Getting your Railway domain...`n" -ForegroundColor Gray

$domain = railway domain

if ($domain) {
    Write-Host "Your backend URL is:" -ForegroundColor Green
    Write-Host "   https://$domain" -ForegroundColor Cyan
    Write-Host "`nTest it:" -ForegroundColor Yellow
    Write-Host "   https://$domain/api/health" -ForegroundColor White
    
    # Save URL to file
    "https://$domain" | Out-File -FilePath "railway-url.txt" -Encoding UTF8
    Write-Host "`nURL saved to railway-url.txt" -ForegroundColor Gray
    
    Write-Host "`nNext Steps:" -ForegroundColor Cyan
    Write-Host "   Run: .\update-backend-url.ps1 -RailwayURL `"https://$domain`"" -ForegroundColor White
} else {
    Write-Host "Domain not found. Generate one in Railway dashboard:" -ForegroundColor Yellow
    Write-Host "   Settings, then Networking, then Generate Domain" -ForegroundColor Gray
}
