# Civic DAO Enhanced Features Setup Script (PowerShell)
# This script sets up the enhanced frontend features on Windows

Write-Host "🚀 Setting up Civic DAO Enhanced Features..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Install additional dependencies for enhanced features
Write-Host "📦 Installing enhanced feature dependencies..." -ForegroundColor Yellow

# Install Radix UI components for advanced UI
npm install @radix-ui/react-slider

# Install additional utility libraries
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-toast @radix-ui/react-tabs @radix-ui/react-progress

# Install chart libraries for analytics
npm install recharts

# Install form handling libraries
npm install react-hook-form @hookform/resolvers zod

# Install date handling
npm install date-fns

# Install additional icons
npm install lucide-react

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green

# Create environment configuration
Write-Host "⚙️ Setting up environment configuration..." -ForegroundColor Yellow

# Create .env.local if it doesn't exist
if (-not (Test-Path "frontend/.env.local")) {
    $envContent = @"
# WalletConnect Project ID
# Get this from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Infura API Keys
NEXT_PUBLIC_INFURA_KEY=your-infura-api-key

# Contract Addresses (update after deployment)
NEXT_PUBLIC_CIVIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_CIVIC_DAO_ADDRESS=0x...
NEXT_PUBLIC_TIMELOCK_ADDRESS=0x...

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Feature Flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ZK_PROOFS=true

# Environment
NODE_ENV=development
"@
    
    $envContent | Out-File -FilePath "frontend/.env.local" -Encoding UTF8
    Write-Host "✅ Environment file created at frontend/.env.local" -ForegroundColor Green
} else {
    Write-Host "⚠️ Environment file already exists at frontend/.env.local" -ForegroundColor Yellow
}

# Create TypeScript types for enhanced features
Write-Host "📝 Creating TypeScript types..." -ForegroundColor Yellow

$typesContent = @"
// Enhanced feature types

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: number
  read: boolean
  actionUrl?: string
}

export interface UserProfile {
  address: string
  balance: string
  votingPower: string
  verified: boolean
  identityHash?: string
  joinedAt: number
  totalVotes: number
  proposalsCreated: number
  reputation: number
  preferences: {
    notifications: boolean
    theme: 'light' | 'dark'
    language: string
  }
}

export interface SearchFilters {
  query: string
  category: string
  status: string
  proposer: string
  budgetRange: [number, number]
  dateRange: {
    start: string
    end: string
  }
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface AnalyticsData {
  overview: {
    totalProposals: number
    activeProposals: number
    totalVotes: number
    participationRate: number
    totalBudget: number
    averageVotingPower: number
  }
  trends: {
    proposalsThisMonth: number
    votesThisMonth: number
    participationTrend: 'up' | 'down' | 'stable'
    budgetUtilization: number
  }
  topCategories: Array<{
    category: string
    count: number
    percentage: number
  }>
  recentActivity: Array<{
    type: 'proposal_created' | 'proposal_executed' | 'vote_cast'
    description: string
    timestamp: number
    user: string
  }>
}
"@

$typesContent | Out-File -FilePath "frontend/types/enhanced.ts" -Encoding UTF8
Write-Host "✅ TypeScript types created" -ForegroundColor Green

# Create utility functions for enhanced features
Write-Host "🔧 Creating utility functions..." -ForegroundColor Yellow

$utilsContent = @"
// Enhanced utility functions

export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return \`\${days} day\${days !== 1 ? 's' : ''} ago\`
  if (hours > 0) return \`\${hours} hour\${hours !== 1 ? 's' : ''} ago\`
  if (minutes > 0) return \`\${minutes} minute\${minutes !== 1 ? 's' : ''} ago\`
  return 'Just now'
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatAddress = (address: string): string => {
  if (!address) return ''
  return \`\${address.slice(0, 6)}...\${address.slice(-4)}\`
}

export const getProposalStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800'
    case 'succeeded':
      return 'bg-green-100 text-green-800'
    case 'defeated':
      return 'bg-red-100 text-red-800'
    case 'executed':
      return 'bg-purple-100 text-purple-800'
    case 'canceled':
      return 'bg-gray-100 text-gray-800'
    case 'expired':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Infrastructure': 'bg-blue-100 text-blue-800 border-blue-200',
    'Environment': 'bg-green-100 text-green-800 border-green-200',
    'Education': 'bg-purple-100 text-purple-800 border-purple-200',
    'Healthcare': 'bg-red-100 text-red-800 border-red-200',
    'Transportation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Safety': 'bg-orange-100 text-orange-800 border-orange-200',
    'Culture': 'bg-pink-100 text-pink-800 border-pink-200',
    'Technology': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Other': 'bg-gray-100 text-gray-800 border-gray-200',
  }
  
  return colors[category] || colors['Other']
}

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
"@

$utilsContent | Out-File -FilePath "frontend/lib/enhanced-utils.ts" -Encoding UTF8
Write-Host "✅ Utility functions created" -ForegroundColor Green

# Create a development script for enhanced features
Write-Host "🛠 Creating development scripts..." -ForegroundColor Yellow

$devScriptContent = @"
# Start the enhanced development environment

Write-Host "🚀 Starting Civic DAO Enhanced Development Environment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Start the frontend development server
Write-Host "📱 Starting frontend development server..." -ForegroundColor Yellow
Set-Location frontend
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"

Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📊 Analytics: http://localhost:3000/dashboard (Analytics tab)" -ForegroundColor Cyan
Write-Host "🔍 Search: http://localhost:3000/dashboard (Advanced Search tab)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
"@

$devScriptContent | Out-File -FilePath "scripts/dev-enhanced.ps1" -Encoding UTF8
Write-Host "✅ Development script created" -ForegroundColor Green

# Create a build script for enhanced features
$buildScriptContent = @"
# Build the enhanced features for production

Write-Host "🏗️ Building Civic DAO Enhanced Features for Production..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Build the frontend
Write-Host "📱 Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build completed successfully!" -ForegroundColor Green
    Write-Host "🚀 You can now start the production server with: npm start" -ForegroundColor Cyan
} else {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
"@

$buildScriptContent | Out-File -FilePath "scripts/build-enhanced.ps1" -Encoding UTF8
Write-Host "✅ Build script created" -ForegroundColor Green

# Create a test script for enhanced features
$testScriptContent = @"
# Test the enhanced features

Write-Host "🧪 Testing Civic DAO Enhanced Features..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Run frontend tests
Write-Host "📱 Running frontend tests..." -ForegroundColor Yellow
Set-Location frontend
npm run test

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed!" -ForegroundColor Red
    exit 1
}
"@

$testScriptContent | Out-File -FilePath "scripts/test-enhanced.ps1" -Encoding UTF8
Write-Host "✅ Test script created" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Enhanced Features Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update frontend/.env.local with your API keys" -ForegroundColor White
Write-Host "2. Run: .\scripts\dev-enhanced.ps1 to start development" -ForegroundColor White
Write-Host "3. Visit: http://localhost:3000/dashboard to see the enhanced features" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Available Scripts:" -ForegroundColor Cyan
Write-Host "- .\scripts\dev-enhanced.ps1 - Start development" -ForegroundColor White
Write-Host "- .\scripts\build-enhanced.ps1 - Build for production" -ForegroundColor White
Write-Host "- .\scripts\test-enhanced.ps1 - Run tests" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- ENHANCED_SETUP.md - Setup guide" -ForegroundColor White
Write-Host "- frontend/FEATURES.md - Feature documentation" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Happy coding!" -ForegroundColor Green
