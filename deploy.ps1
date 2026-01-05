# Automated Deployment Script for Todo App (PowerShell)
# This script prepares and initiates deployment

Write-Host "`n🚀 Starting automated deployment...`n" -ForegroundColor Blue

# Navigate to project directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "Step 1: Committing deployment configurations..." -ForegroundColor Cyan
git add .
git commit -m "feat: add render.yaml for one-click deployment" -ErrorAction SilentlyContinue

Write-Host "`nStep 2: Pushing to GitHub..." -ForegroundColor Cyan
git push origin 004-fullstack-web-app

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Code successfully pushed to GitHub`n" -ForegroundColor Green
} else {
    Write-Host "`n⚠ Push may have failed. Please check manually.`n" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT READY!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Your application is ready to deploy!`n" -ForegroundColor White

Write-Host "EASIEST METHOD - One-Click Deploy:" -ForegroundColor Yellow
Write-Host "1. Click this link: " -NoNewline -ForegroundColor White
Write-Host "https://render.com/deploy?repo=https://github.com/zareenarif/todo-app-phase-2" -ForegroundColor Cyan
Write-Host "2. Sign in with GitHub (takes 30 seconds)" -ForegroundColor White
Write-Host "3. Click 'Apply' - Everything deploys automatically!" -ForegroundColor White
Write-Host "4. Wait 5-10 minutes for deployment to complete`n" -ForegroundColor White

Write-Host "What gets deployed:" -ForegroundColor Yellow
Write-Host "  ✓ PostgreSQL database (free tier)" -ForegroundColor Green
Write-Host "  ✓ Backend API (FastAPI)" -ForegroundColor Green
Write-Host "  ✓ Frontend (Next.js)" -ForegroundColor Green
Write-Host "  ✓ All environment variables configured automatically" -ForegroundColor Green
Write-Host "  ✓ Database migrations run automatically`n" -ForegroundColor Green

Write-Host "After deployment, you'll get:" -ForegroundColor Yellow
Write-Host "  • Frontend URL: https://todo-frontend-xxxx.onrender.com" -ForegroundColor White
Write-Host "  • Backend URL: https://todo-api-xxxx.onrender.com" -ForegroundColor White
Write-Host "  • Database: Fully configured and connected`n" -ForegroundColor White

Write-Host "========================================" -ForegroundColor Green
Write-Host "Press any key to open the deployment page..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open the deployment URL in default browser
Start-Process "https://render.com/deploy?repo=https://github.com/zareenarif/todo-app-phase-2"

Write-Host "`n✓ Deployment page opened in your browser!" -ForegroundColor Green
Write-Host "Follow the on-screen instructions to complete deployment.`n" -ForegroundColor White
