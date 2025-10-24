# Civic DAO - API Configuration Script
# This script helps you configure all the necessary APIs for your governance platform

Write-Host "🚀 Civic DAO - API Configuration Setup" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "frontend/package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 This script will help you configure the following APIs:" -ForegroundColor Cyan
Write-Host "1. Alchemy (Blockchain data)" -ForegroundColor White
Write-Host "2. WalletConnect (Wallet connections)" -ForegroundColor White
Write-Host "3. Tally (Governance data)" -ForegroundColor White
Write-Host "4. World ID (ZK-proof identity)" -ForegroundColor White
Write-Host "5. Pinata (IPFS storage)" -ForegroundColor White
Write-Host "6. Mixpanel (Analytics)" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Let's start configuring your APIs..." -ForegroundColor Yellow

# Create environment file if it doesn't exist
$envFile = "frontend/.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "📝 Creating environment file..." -ForegroundColor Yellow
    
    $envContent = @"
# ===========================================
# CIVIC DAO - API CONFIGURATION
# ===========================================

# ===========================================
# BLOCKCHAIN & WEB3 APIs
# ===========================================

# Alchemy (Recommended for blockchain data)
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-api-key
NEXT_PUBLIC_ALCHEMY_NETWORK=polygon-mainnet

# Infura (Alternative blockchain provider)
NEXT_PUBLIC_INFURA_KEY=your-infura-api-key

# ===========================================
# WALLET CONNECTION
# ===========================================

# WalletConnect (Essential for mobile wallets)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# ===========================================
# GOVERNANCE & DAO APIs
# ===========================================

# Tally (Recommended for DAO governance data)
NEXT_PUBLIC_TALLY_API_KEY=your-tally-api-key
NEXT_PUBLIC_TALLY_DAO_ID=your-dao-id

# Snapshot (Alternative governance platform)
NEXT_PUBLIC_SNAPSHOT_API_URL=https://hub.snapshot.org/api
NEXT_PUBLIC_SNAPSHOT_SPACE_ID=your-space-id

# ===========================================
# IDENTITY & ZK-PROOFS
# ===========================================

# World ID (Recommended for ZK identity)
NEXT_PUBLIC_WORLD_ID_APP_ID=your-world-id-app-id
NEXT_PUBLIC_WORLD_ID_ACTION_ID=your-action-id

# Semaphore (Alternative ZK-proof system)
NEXT_PUBLIC_SEMAPHORE_GROUP_ID=your-semaphore-group-id
NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS=0x...

# ===========================================
# DECENTRALIZED STORAGE
# ===========================================

# Pinata (Recommended IPFS service)
NEXT_PUBLIC_PINATA_API_KEY=your-pinata-api-key
NEXT_PUBLIC_PINATA_SECRET_KEY=your-pinata-secret-key
NEXT_PUBLIC_PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/

# Web3.Storage (Alternative IPFS service)
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your-web3-storage-token

# ===========================================
# ANALYTICS & MONITORING
# ===========================================

# Mixpanel (User analytics)
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token

# PostHog (Alternative analytics)
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ===========================================
# SMART CONTRACTS
# ===========================================

# Contract Addresses (Update after deployment)
NEXT_PUBLIC_CIVIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_CIVIC_DAO_ADDRESS=0x...
NEXT_PUBLIC_TIMELOCK_ADDRESS=0x...
NEXT_PUBLIC_GOVERNOR_ADDRESS=0x...

# ===========================================
# BACKEND API
# ===========================================

# Your backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1

# ===========================================
# FEATURE FLAGS
# ===========================================

# Enable/disable features
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ZK_PROOFS=true
NEXT_PUBLIC_ENABLE_IPFS=true
NEXT_PUBLIC_ENABLE_GOVERNANCE_API=true

# ===========================================
# ENVIRONMENT
# ===========================================

NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
"@
    
    $envContent | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "✅ Environment file created at $envFile" -ForegroundColor Green
} else {
    Write-Host "⚠️ Environment file already exists at $envFile" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔗 Now let's configure each API step by step..." -ForegroundColor Cyan

# 1. Alchemy Configuration
Write-Host ""
Write-Host "1️⃣ Alchemy (Blockchain Data)" -ForegroundColor Yellow
Write-Host "   Visit: https://www.alchemy.com/" -ForegroundColor White
Write-Host "   Steps:" -ForegroundColor White
Write-Host "   - Create account" -ForegroundColor White
Write-Host "   - Create new app" -ForegroundColor White
Write-Host "   - Select 'Polygon' network" -ForegroundColor White
Write-Host "   - Copy API key" -ForegroundColor White
Write-Host "   - Update NEXT_PUBLIC_ALCHEMY_API_KEY in .env.local" -ForegroundColor White

# 2. WalletConnect Configuration
Write-Host ""
Write-Host "2️⃣ WalletConnect (Wallet Connections)" -ForegroundColor Yellow
Write-Host "   Visit: https://cloud.walletconnect.com/" -ForegroundColor White
Write-Host "   Steps:" -ForegroundColor White
Write-Host "   - Create account" -ForegroundColor White
Write-Host "   - Create new project" -ForegroundColor White
Write-Host "   - Copy Project ID" -ForegroundColor White
Write-Host "   - Update NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local" -ForegroundColor White

# 3. Tally Configuration
Write-Host ""
Write-Host "3️⃣ Tally (Governance Data)" -ForegroundColor Yellow
Write-Host "   Visit: https://www.tally.xyz/" -ForegroundColor White
Write-Host "   Steps:" -ForegroundColor White
Write-Host "   - Create account" -ForegroundColor White
Write-Host "   - Create new DAO" -ForegroundColor White
Write-Host "   - Get API access" -ForegroundColor White
Write-Host "   - Update NEXT_PUBLIC_TALLY_API_KEY and NEXT_PUBLIC_TALLY_DAO_ID in .env.local" -ForegroundColor White

# 4. World ID Configuration
Write-Host ""
Write-Host "4️⃣ World ID (ZK-Proof Identity)" -ForegroundColor Yellow
Write-Host "   Visit: https://worldcoin.org/world-id" -ForegroundColor White
Write-Host "   Steps:" -ForegroundColor White
Write-Host "   - Create account" -ForegroundColor White
Write-Host "   - Create new app" -ForegroundColor White
Write-Host "   - Get App ID and Action ID" -ForegroundColor White
Write-Host "   - Update NEXT_PUBLIC_WORLD_ID_APP_ID and NEXT_PUBLIC_WORLD_ID_ACTION_ID in .env.local" -ForegroundColor White

# 5. Pinata Configuration
Write-Host ""
Write-Host "5️⃣ Pinata (IPFS Storage)" -ForegroundColor Yellow
Write-Host "   Visit: https://www.pinata.cloud/" -ForegroundColor White
Write-Host "   Steps:" -ForegroundColor White
Write-Host "   - Create account" -ForegroundColor White
Write-Host "   - Get API keys from dashboard" -ForegroundColor White
Write-Host "   - Update NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_SECRET_KEY in .env.local" -ForegroundColor White

# 6. Mixpanel Configuration
Write-Host ""
Write-Host "6️⃣ Mixpanel (Analytics)" -ForegroundColor Yellow
Write-Host "   Visit: https://mixpanel.com/" -ForegroundColor White
Write-Host "   Steps:" -ForegroundColor White
Write-Host "   - Create account" -ForegroundColor White
Write-Host "   - Create new project" -ForegroundColor White
Write-Host "   - Get project token" -ForegroundColor White
Write-Host "   - Update NEXT_PUBLIC_MIXPANEL_TOKEN in .env.local" -ForegroundColor White

Write-Host ""
Write-Host "📝 Quick Setup Commands:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Open environment file for editing" -ForegroundColor White
Write-Host "notepad frontend/.env.local" -ForegroundColor Gray
Write-Host ""
Write-Host "# Or use VS Code" -ForegroundColor White
Write-Host "code frontend/.env.local" -ForegroundColor Gray

Write-Host ""
Write-Host "🧪 Test Your API Configuration:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Test API connections" -ForegroundColor White
Write-Host "npm run test:apis" -ForegroundColor Gray
Write-Host ""
Write-Host "# Start development server" -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor Gray

Write-Host ""
Write-Host "💰 Cost Estimation:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Free Tier (MVP):" -ForegroundColor White
Write-Host "- Alchemy: 300M compute units/month" -ForegroundColor Gray
Write-Host "- WalletConnect: Basic usage" -ForegroundColor Gray
Write-Host "- Tally: Public data access" -ForegroundColor Gray
Write-Host "- World ID: Basic verification" -ForegroundColor Gray
Write-Host "- Pinata: 1GB storage" -ForegroundColor Gray
Write-Host "- Mixpanel: 100k events/month" -ForegroundColor Gray
Write-Host "Total: $0/month" -ForegroundColor Green

Write-Host ""
Write-Host "Production Tier:" -ForegroundColor White
Write-Host "- Alchemy: $50-100/month" -ForegroundColor Gray
Write-Host "- Pinata: $20/month" -ForegroundColor Gray
Write-Host "- Mixpanel: $25/month" -ForegroundColor Gray
Write-Host "Total: ~$95-145/month" -ForegroundColor Yellow

Write-Host ""
Write-Host "🎯 Recommended Starting APIs:" -ForegroundColor Cyan
Write-Host ""
Write-Host "For MVP (Minimum Viable Product):" -ForegroundColor White
Write-Host "1. Alchemy - Blockchain data" -ForegroundColor Gray
Write-Host "2. WalletConnect - Wallet connections" -ForegroundColor Gray
Write-Host "3. Tally - Governance data" -ForegroundColor Gray
Write-Host "4. Pinata - File storage" -ForegroundColor Gray

Write-Host ""
Write-Host "For Production:" -ForegroundColor White
Write-Host "1. Alchemy - Blockchain infrastructure" -ForegroundColor Gray
Write-Host "2. WalletConnect - Wallet connections" -ForegroundColor Gray
Write-Host "3. Tally - Governance analytics" -ForegroundColor Gray
Write-Host "4. World ID - ZK-proof identity" -ForegroundColor Gray
Write-Host "5. Pinata - Decentralized storage" -ForegroundColor Gray
Write-Host "6. Mixpanel - User analytics" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ API Configuration Guide Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Visit the URLs above to create your API accounts" -ForegroundColor White
Write-Host "2. Update the environment variables in frontend/.env.local" -ForegroundColor White
Write-Host "3. Test your API connections" -ForegroundColor White
Write-Host "4. Start building your governance platform!" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Happy coding!" -ForegroundColor Green
