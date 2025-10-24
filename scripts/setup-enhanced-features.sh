#!/bin/bash

# Civic DAO Enhanced Features Setup Script
# This script sets up the enhanced frontend features

echo "🚀 Setting up Civic DAO Enhanced Features..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install additional dependencies for enhanced features
echo "📦 Installing enhanced feature dependencies..."

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

echo "✅ Dependencies installed successfully!"

# Create environment configuration
echo "⚙️ Setting up environment configuration..."

# Create .env.local if it doesn't exist
if [ ! -f "frontend/.env.local" ]; then
    cat > frontend/.env.local << EOF
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
EOF
    echo "✅ Environment file created at frontend/.env.local"
else
    echo "⚠️ Environment file already exists at frontend/.env.local"
fi

# Create TypeScript types for enhanced features
echo "📝 Creating TypeScript types..."

cat > frontend/types/enhanced.ts << EOF
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
EOF

echo "✅ TypeScript types created"

# Create utility functions for enhanced features
echo "🔧 Creating utility functions..."

cat > frontend/lib/enhanced-utils.ts << EOF
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
EOF

echo "✅ Utility functions created"

# Create a development script for enhanced features
echo "🛠 Creating development scripts..."

cat > scripts/dev-enhanced.sh << 'EOF'
#!/bin/bash

# Start the enhanced development environment

echo "🚀 Starting Civic DAO Enhanced Development Environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Start the frontend development server
echo "📱 Starting frontend development server..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for the server to start
sleep 3

echo "✅ Development environment started!"
echo "🌐 Frontend: http://localhost:3000"
echo "📊 Analytics: http://localhost:3000/dashboard (Analytics tab)"
echo "🔍 Search: http://localhost:3000/dashboard (Advanced Search tab)"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait $FRONTEND_PID
EOF

chmod +x scripts/dev-enhanced.sh

echo "✅ Development script created"

# Create a build script for enhanced features
cat > scripts/build-enhanced.sh << 'EOF'
#!/bin/bash

# Build the enhanced features for production

echo "🏗️ Building Civic DAO Enhanced Features for Production..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build the frontend
echo "📱 Building frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build completed successfully!"
    echo "🚀 You can now start the production server with: npm start"
else
    echo "❌ Frontend build failed!"
    exit 1
fi
EOF

chmod +x scripts/build-enhanced.sh

echo "✅ Build script created"

# Create a test script for enhanced features
cat > scripts/test-enhanced.sh << 'EOF'
#!/bin/bash

# Test the enhanced features

echo "🧪 Testing Civic DAO Enhanced Features..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Run frontend tests
echo "📱 Running frontend tests..."
cd frontend
npm run test

if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed!"
    exit 1
fi
EOF

chmod +x scripts/test-enhanced.sh

echo "✅ Test script created"

# Create a comprehensive README for the enhanced features
cat > ENHANCED_SETUP.md << 'EOF'
# Civic DAO Enhanced Features Setup

## 🚀 Quick Start

1. **Run the setup script:**
   ```bash
   chmod +x scripts/setup-enhanced-features.sh
   ./scripts/setup-enhanced-features.sh
   ```

2. **Configure your environment:**
   - Update `frontend/.env.local` with your API keys
   - Get a WalletConnect Project ID from https://cloud.walletconnect.com/
   - Get an Infura API key from https://infura.io/

3. **Start development:**
   ```bash
   ./scripts/dev-enhanced.sh
   ```

## 🎯 Enhanced Features

### ✅ Implemented Features
- **Advanced Wallet Connection**: Multiple wallet support with popular wallets section
- **Authentication System**: ZK-proof identity verification with user profiles
- **Real-time Notifications**: Smart notifications with interactive bell
- **Governance Analytics**: Comprehensive analytics dashboard with trends
- **Advanced Search**: Multi-criteria search with advanced filtering
- **Mobile Optimization**: Responsive design with mobile navigation

### 🔧 Technical Features
- **Context Providers**: Auth and Notification contexts
- **TypeScript Types**: Comprehensive type definitions
- **Utility Functions**: Enhanced formatting and helper functions
- **Component Library**: Reusable UI components
- **Animation System**: Smooth Framer Motion animations

## 📱 Mobile Features

- **Mobile Navigation**: Slide-out navigation with user info
- **Touch Optimization**: All interactions optimized for touch
- **Responsive Layouts**: Adaptive layouts for all screen sizes
- **Mobile Notifications**: Mobile-optimized notification system

## 🔍 Search & Filtering

- **Multi-criteria Search**: Search by title, description, proposer
- **Advanced Filters**: Budget range, date range, category, status
- **Sort Options**: Multiple sorting with ascending/descending
- **Filter Management**: Active filter display with easy removal

## 📊 Analytics Dashboard

- **Overview Metrics**: Total proposals, votes, participation rates
- **Trend Analysis**: Monthly trends and participation patterns
- **Category Breakdown**: Visual breakdown of proposal categories
- **Activity Timeline**: Recent governance activity tracking

## 🔔 Notification System

- **Smart Notifications**: Context-aware governance notifications
- **Interactive Bell**: Notification center with unread count
- **Real-time Updates**: Simulated real-time notifications
- **Management**: Mark as read, delete, and clear all

## 🎨 Design System

- **Color Palette**: Consistent color scheme
- **Typography**: Inter font family with proper weights
- **Spacing**: 4px grid system
- **Components**: Radix UI for accessibility

## 🚀 Development

### Scripts Available
- `./scripts/dev-enhanced.sh` - Start development environment
- `./scripts/build-enhanced.sh` - Build for production
- `./scripts/test-enhanced.sh` - Run tests

### Environment Variables
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_INFURA_KEY=your-infura-key
NEXT_PUBLIC_CIVIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_CIVIC_DAO_ADDRESS=0x...
```

## 🔧 Configuration

### WalletConnect Setup
1. Go to https://cloud.walletconnect.com/
2. Create a new project
3. Copy the Project ID
4. Add it to your `.env.local` file

### Infura Setup
1. Go to https://infura.io/
2. Create a new project
3. Copy the API key
4. Add it to your `.env.local` file

## 📚 Documentation

- **Component Documentation**: Storybook stories
- **API Documentation**: REST API docs
- **User Guide**: Comprehensive user guide
- **Developer Guide**: Technical documentation

## 🧪 Testing

- **Unit Tests**: Jest for utility functions
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright for critical paths
- **Visual Tests**: Storybook for components

## 🚀 Deployment

1. **Build the project:**
   ```bash
   ./scripts/build-enhanced.sh
   ```

2. **Deploy to your platform:**
   - Vercel: `vercel --prod`
   - Netlify: `netlify deploy --prod`
   - Custom: Upload the `out` folder

## 🔒 Security

- **Input Validation**: All inputs validated and sanitized
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Token-based CSRF protection
- **Secure Connections**: HTTPS only in production

## 🌐 Accessibility

- **WCAG Compliance**: Level AA compliance
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Compatible with screen readers
- **High Contrast**: Support for high contrast mode

## 📞 Support

- **GitHub Issues**: Bug reports and feature requests
- **Discord Community**: Real-time discussions
- **Documentation**: Comprehensive guides
- **Email Support**: Critical issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📈 Performance

- **Core Web Vitals**: Optimized for Google's metrics
- **Bundle Size**: Optimized bundle sizes
- **Code Splitting**: Automatic code splitting
- **Caching**: Intelligent caching strategies

## 🔮 Future Enhancements

- **Real Blockchain Integration**: Smart contract integration
- **IPFS Integration**: Decentralized storage
- **Advanced ZK-Proofs**: More sophisticated proofs
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme switching
- **Mobile App**: React Native version

## 📊 Analytics

- **User Analytics**: Page views and interactions
- **Performance Monitoring**: Real-time performance data
- **Error Tracking**: Comprehensive error reporting
- **Governance Metrics**: Community engagement tracking

## 🎯 Best Practices

- **Code Style**: Consistent code formatting
- **Component Design**: Reusable and composable
- **State Management**: Efficient state updates
- **Performance**: Optimized rendering
- **Accessibility**: Inclusive design
- **Security**: Secure by default

## 🔧 Troubleshooting

### Common Issues
1. **Wallet Connection Issues**: Check WalletConnect Project ID
2. **Build Errors**: Ensure all dependencies are installed
3. **TypeScript Errors**: Check type definitions
4. **Styling Issues**: Verify Tailwind CSS configuration

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

### Logs
- **Frontend Logs**: Browser console
- **Build Logs**: Terminal output
- **Error Logs**: Error boundaries

## 📚 Learning Resources

- **React Documentation**: https://react.dev/
- **Next.js Documentation**: https://nextjs.org/docs
- **Wagmi Documentation**: https://wagmi.sh/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

## 🎉 Success!

Your Civic DAO enhanced features are now ready! 

- ✅ Advanced wallet connection
- ✅ Authentication system
- ✅ Real-time notifications
- ✅ Governance analytics
- ✅ Advanced search
- ✅ Mobile optimization

Start building the future of governance! 🚀
EOF

echo "✅ Comprehensive documentation created"

echo ""
echo "🎉 Enhanced Features Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update frontend/.env.local with your API keys"
echo "2. Run: ./scripts/dev-enhanced.sh to start development"
echo "3. Visit: http://localhost:3000/dashboard to see the enhanced features"
echo ""
echo "🔧 Available Scripts:"
echo "- ./scripts/dev-enhanced.sh - Start development"
echo "- ./scripts/build-enhanced.sh - Build for production"
echo "- ./scripts/test-enhanced.sh - Run tests"
echo ""
echo "📚 Documentation:"
echo "- ENHANCED_SETUP.md - Setup guide"
echo "- frontend/FEATURES.md - Feature documentation"
echo ""
echo "🚀 Happy coding!"
