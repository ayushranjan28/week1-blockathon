# Civic DAO - Simplified Deployment Script
Write-Host "🚀 Starting Civic DAO Simplified Deployment..." -ForegroundColor Green
Write-Host "📋 Only WalletConnect Cloud API key required!" -ForegroundColor Cyan

# Check if we're in the frontend directory
if (-not (Test-Path "package.json") -or -not (Test-Path "app")) {
    Write-Host "❌ Error: Please run this script from the frontend directory" -ForegroundColor Red
    exit 1
}

# Check for WalletConnect Project ID
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    
    $envContent = @"
# Civic DAO - Simplified Environment Variables
# Only essential APIs for Vercel deployment

# App Configuration
NEXT_PUBLIC_APP_NAME=Civic DAO
NEXT_PUBLIC_APP_URL=https://civic-dao.vercel.app

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology

# WalletConnect Cloud (REQUIRED - Single API key for all wallets)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Contract Addresses (Update after deployment)
NEXT_PUBLIC_CIVIC_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CIVIC_DAO_ADDRESS=0x0000000000000000000000000000000000000000

# API Configuration (Backend URL - Optional)
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Optional: IPFS for file storage (if needed)
NEXT_PUBLIC_PINATA_API_KEY=your-pinata-api-key
NEXT_PUBLIC_PINATA_SECRET_KEY=your-pinata-secret-key
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Created .env.local file" -ForegroundColor Green
    Write-Host "⚠️  Please update NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID with your actual Project ID" -ForegroundColor Yellow
    Write-Host "🔗 Get your Project ID from: https://cloud.walletconnect.com" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to continue after updating the Project ID..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Install Vercel CLI if not already installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI already installed" -ForegroundColor Green
} catch {
    Write-Host "📥 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "📝 Make sure to configure environment variables in Vercel dashboard" -ForegroundColor Cyan

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your Civic DAO is now live on Vercel!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Configure environment variables in Vercel dashboard" -ForegroundColor White
    Write-Host "2. Deploy your smart contracts" -ForegroundColor White
    Write-Host "3. Update contract addresses in environment variables" -ForegroundColor White
    Write-Host "4. Test wallet connection and voting" -ForegroundColor White
    Write-Host ""
    Write-Host "🔑 Required environment variables:" -ForegroundColor Yellow
    Write-Host "- NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_CIVIC_TOKEN_ADDRESS (after deployment)" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_CIVIC_DAO_ADDRESS (after deployment)" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed. Please check the errors above." -ForegroundColor Red
    exit 1
}
