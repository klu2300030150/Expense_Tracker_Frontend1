# This script will update the frontend to use your Railway backend
# Run this AFTER you've deployed your backend to Railway

param(
    [Parameter(Mandatory=$true)]
    [string]$RailwayURL
)

Write-Host "🚀 Updating frontend to use Railway backend..." -ForegroundColor Cyan
Write-Host "Backend URL: $RailwayURL" -ForegroundColor Green

# Update config.js
$configPath = "src\config.js"
$configContent = @"
// API Configuration
// Production (GitHub Pages): Railway backend
// Local dev: http://localhost:5000

const API_BASE_URL = '$RailwayURL';

export default API_BASE_URL;
"@

Set-Content -Path $configPath -Value $configContent -Force
Write-Host "✅ Updated $configPath" -ForegroundColor Green

# Build for GitHub Pages
Write-Host "`n📦 Building frontend for GitHub Pages..." -ForegroundColor Cyan
npm run build

# Commit and push
Write-Host "`n💾 Committing changes..." -ForegroundColor Cyan
git add .
git commit -m "Connect frontend to Railway backend: $RailwayURL"
git push

# Deploy to GitHub Pages
Write-Host "`n🌐 Deploying to GitHub Pages..." -ForegroundColor Cyan
npm run deploy

Write-Host "`n✨ Done! Your app should now work on GitHub Pages!" -ForegroundColor Green
Write-Host "Visit: https://klu2300030150.github.io/Expense_Tracker_Frontend1/" -ForegroundColor Cyan
Write-Host "`nTest your backend first:" -ForegroundColor Yellow
Write-Host "$RailwayURL/api/health" -ForegroundColor White
