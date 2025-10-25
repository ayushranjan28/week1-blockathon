# Civic DAO Vercel Deployment Script (PowerShell)
Write-Host "🚀 Starting Civic DAO deployment to Vercel..." -ForegroundColor Green

# Check if we're in the frontend directory
if (-not (Test-Path "package.json") -or -not (Test-Path "app")) {
    Write-Host "❌ Error: Please run this script from the frontend directory" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

# Install Vercel CLI if not already installed
try {
    vercel --version | Out-Null
} catch {
    Write-Host "📥 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

# Check deployment status
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your app is now live on Vercel" -ForegroundColor Green
    Write-Host "📝 Don't forget to configure environment variables in the Vercel dashboard" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed. Please check the errors above." -ForegroundColor Red
    exit 1
}
