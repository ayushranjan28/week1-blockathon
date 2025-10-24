# 🔑 Civic DAO - Complete API Keys Guide

This comprehensive guide covers all the API keys and services used in the Civic DAO project, organized by category and priority.

## 📋 **Quick Reference**

### **Essential APIs (Required for MVP)**
- ✅ **Alchemy** - Blockchain infrastructure
- ✅ **WalletConnect** - Wallet connections
- ✅ **Pinata** - IPFS storage

### **Recommended APIs (For Production)**
- 🏛️ **Tally** - Governance analytics
- 🔐 **World ID** - ZK-proof identity
- 📊 **Mixpanel** - User analytics

### **Optional APIs (For Enhanced Features)**
- 🔄 **Infura** - Alternative blockchain
- 📸 **Snapshot** - Alternative governance
- 🎯 **PostHog** - Alternative analytics

---

## 🏗️ **API Categories**

### 1. **Blockchain & Web3 APIs** ⛓️

#### **Alchemy (Primary - Recommended)**
```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-api-key
NEXT_PUBLIC_ALCHEMY_NETWORK=polygon-mainnet
```
- **Purpose**: Primary blockchain infrastructure provider
- **Features**: Multi-chain support, enhanced APIs, real-time monitoring
- **Setup**: [https://www.alchemy.com/](https://www.alchemy.com/)
- **Cost**: Free tier (300M compute units), then $0.10/1M units
- **Priority**: 🔴 **Essential**

#### **Infura (Alternative)**
```env
NEXT_PUBLIC_INFURA_KEY=your-infura-api-key
NEXT_PUBLIC_INFURA_PROJECT_ID=your-infura-project-id
```
- **Purpose**: Alternative blockchain infrastructure
- **Features**: Basic RPC access, some enhanced APIs
- **Setup**: [https://infura.io/](https://infura.io/)
- **Cost**: Free tier (100k requests/day), then $50/month
- **Priority**: 🟡 **Optional**

#### **WalletConnect (Essential)**
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```
- **Purpose**: Mobile wallet connections
- **Features**: QR code connections, deep linking, session management
- **Setup**: [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
- **Cost**: Free for basic usage
- **Priority**: 🔴 **Essential**

---

### 2. **Governance & DAO APIs** 🏛️

#### **Tally (Recommended)**
```env
NEXT_PUBLIC_TALLY_API_KEY=your-tally-api-key
NEXT_PUBLIC_TALLY_DAO_ID=your-dao-id
```
- **Purpose**: Specialized DAO governance data
- **Features**: Proposal aggregation, voting analytics, DAO metrics
- **Setup**: [https://www.tally.xyz/](https://www.tally.xyz/)
- **Cost**: Free for public data
- **Priority**: 🟠 **Recommended**

#### **Snapshot (Alternative)**
```env
NEXT_PUBLIC_SNAPSHOT_API_URL=https://hub.snapshot.org/api
NEXT_PUBLIC_SNAPSHOT_SPACE_ID=your-space-id
```
- **Purpose**: Popular governance platform
- **Features**: Proposal creation, voting, space management
- **Setup**: [https://snapshot.org/](https://snapshot.org/)
- **Cost**: Free
- **Priority**: 🟡 **Optional**

---

### 3. **Identity & ZK-Proof APIs** 🔐

#### **World ID (Recommended)**
```env
NEXT_PUBLIC_WORLD_ID_APP_ID=your-world-id-app-id
NEXT_PUBLIC_WORLD_ID_ACTION_ID=your-action-id
```
- **Purpose**: Leading ZK-proof identity solution
- **Features**: Privacy-preserving verification, sybil resistance
- **Setup**: [https://worldcoin.org/world-id](https://worldcoin.org/world-id)
- **Cost**: Free for basic usage
- **Priority**: 🟠 **Recommended**

#### **Semaphore (Alternative)**
```env
NEXT_PUBLIC_SEMAPHORE_GROUP_ID=your-semaphore-group-id
NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS=0x...
```
- **Purpose**: Open-source ZK-proof system
- **Features**: Anonymous voting, identity verification
- **Setup**: [https://semaphore.appliedzkp.org/](https://semaphore.appliedzkp.org/)
- **Cost**: Free (open source)
- **Priority**: 🟡 **Optional**

---

### 4. **Decentralized Storage APIs** 📁

#### **Pinata (Recommended)**
```env
NEXT_PUBLIC_PINATA_API_KEY=your-pinata-api-key
NEXT_PUBLIC_PINATA_SECRET_KEY=your-pinata-secret-key
NEXT_PUBLIC_PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/
```
- **Purpose**: Reliable IPFS pinning service
- **Features**: File upload, metadata, pinning, CDN
- **Setup**: [https://www.pinata.cloud/](https://www.pinata.cloud/)
- **Cost**: Free tier (1GB), then $20/month
- **Priority**: 🔴 **Essential**

#### **Web3.Storage (Alternative)**
```env
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your-web3-storage-token
```
- **Purpose**: Simple IPFS storage
- **Features**: Easy file upload, decentralized storage
- **Setup**: [https://web3.storage/](https://web3.storage/)
- **Cost**: Free tier (5GB), then $0.10/GB
- **Priority**: 🟡 **Optional**

---

### 5. **Analytics & Monitoring APIs** 📊

#### **Mixpanel (Recommended)**
```env
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token
```
- **Purpose**: Detailed user behavior tracking
- **Features**: Event tracking, user journeys, funnels, cohorts
- **Setup**: [https://mixpanel.com/](https://mixpanel.com/)
- **Cost**: Free tier (100k events), then $25/month
- **Priority**: 🟠 **Recommended**

#### **PostHog (Alternative)**
```env
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```
- **Purpose**: Open-source analytics
- **Features**: Event tracking, feature flags, session recordings
- **Setup**: [https://posthog.com/](https://posthog.com/)
- **Cost**: Free tier (1M events), then $20/month
- **Priority**: 🟡 **Optional**

#### **Google Analytics**
```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```
- **Purpose**: Web analytics
- **Features**: Traffic analysis, user behavior, conversion tracking
- **Setup**: [https://analytics.google.com/](https://analytics.google.com/)
- **Cost**: Free
- **Priority**: 🟡 **Optional**

---

### 6. **Security & Authentication APIs** 🔒

#### **Auth0**
```env
NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=your-auth0-audience
```
- **Purpose**: Authentication and authorization
- **Features**: Social login, MFA, user management
- **Setup**: [https://auth0.com/](https://auth0.com/)
- **Cost**: Free tier (7,000 active users), then $23/month
- **Priority**: 🟡 **Optional**

---

### 7. **Database & Cache APIs** 🗄️

#### **MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/civic-dao
MONGODB_TEST_URI=mongodb://localhost:27017/civic-dao-test
```
- **Purpose**: Primary database
- **Features**: Document storage, flexible schema, scalability
- **Setup**: [https://www.mongodb.com/](https://www.mongodb.com/)
- **Cost**: Free tier (512MB), then $9/month
- **Priority**: 🔴 **Essential**

#### **Redis**
```env
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
```
- **Purpose**: Caching and session storage
- **Features**: In-memory storage, pub/sub, persistence
- **Setup**: [https://redis.io/](https://redis.io/)
- **Cost**: Free for self-hosted, $15/month for managed
- **Priority**: 🟠 **Recommended**

---

### 8. **Email Services** 📧

#### **SendGrid (Recommended)**
```env
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@civicdao.com
```
- **Purpose**: Transactional email service
- **Features**: Email delivery, templates, analytics
- **Setup**: [https://sendgrid.com/](https://sendgrid.com/)
- **Cost**: Free tier (100 emails/day), then $14.95/month
- **Priority**: 🟠 **Recommended**

#### **Mailgun (Alternative)**
```env
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain.com
```
- **Purpose**: Email service provider
- **Features**: Email delivery, tracking, analytics
- **Setup**: [https://www.mailgun.com/](https://www.mailgun.com/)
- **Cost**: Free tier (5,000 emails/month), then $35/month
- **Priority**: 🟡 **Optional**

#### **AWS SES (Alternative)**
```env
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
```
- **Purpose**: Amazon's email service
- **Features**: High deliverability, scalability, integration
- **Setup**: [https://aws.amazon.com/ses/](https://aws.amazon.com/ses/)
- **Cost**: $0.10 per 1,000 emails
- **Priority**: 🟡 **Optional**

---

### 9. **Smart Contract APIs** 📜

#### **Block Explorer APIs**
```env
POLYGONSCAN_API_KEY=your-polygonscan-api-key
ETHERSCAN_API_KEY=your-etherscan-api-key
ARBISCAN_API_KEY=your-arbiscan-api-key
```
- **Purpose**: Contract verification and interaction
- **Features**: Contract verification, transaction history, gas tracking
- **Setup**: [https://polygonscan.com/](https://polygonscan.com/), [https://etherscan.io/](https://etherscan.io/)
- **Cost**: Free
- **Priority**: 🟠 **Recommended**

---

### 10. **Monitoring & Logging APIs** 📈

#### **Sentry**
```env
SENTRY_DSN=your-sentry-dsn
```
- **Purpose**: Error tracking and performance monitoring
- **Features**: Error reporting, performance monitoring, release tracking
- **Setup**: [https://sentry.io/](https://sentry.io/)
- **Cost**: Free tier (5k errors/month), then $26/month
- **Priority**: 🟠 **Recommended**

---

## 💰 **Cost Estimation**

### **Free Tier Setup (MVP)**
- **Alchemy**: 300M compute units/month (free)
- **WalletConnect**: Basic usage (free)
- **Pinata**: 1GB storage (free)
- **MongoDB**: 512MB storage (free)
- **Total**: $0/month

### **Production Setup (Recommended)**
- **Alchemy**: $50-100/month (based on usage)
- **Pinata**: $20/month (5GB storage)
- **Mixpanel**: $25/month (analytics)
- **SendGrid**: $14.95/month (email)
- **MongoDB**: $9/month (database)
- **Total**: ~$119-169/month

### **Enterprise Setup (Full Features)**
- **Alchemy**: $100-200/month
- **Pinata**: $50/month (25GB storage)
- **Mixpanel**: $50/month (analytics)
- **SendGrid**: $89.95/month (email)
- **MongoDB**: $57/month (database)
- **Auth0**: $23/month (auth)
- **Total**: ~$369-469/month

---

## 🚀 **Quick Setup Guide**

### **Step 1: Essential APIs (Required)**
```bash
# 1. Alchemy
# Visit: https://www.alchemy.com/
# Create account → Create new app → Copy API key

# 2. WalletConnect
# Visit: https://cloud.walletconnect.com/
# Create project → Copy Project ID

# 3. Pinata
# Visit: https://www.pinata.cloud/
# Create account → Get API keys
```

### **Step 2: Recommended APIs (Production)**
```bash
# 4. Tally
# Visit: https://www.tally.xyz/
# Create DAO → Get API access

# 5. World ID
# Visit: https://worldcoin.org/world-id
# Create app → Get App ID

# 6. Mixpanel
# Visit: https://mixpanel.com/
# Create project → Get token
```

### **Step 3: Optional APIs (Enhanced Features)**
```bash
# 7. Infura (Alternative to Alchemy)
# Visit: https://infura.io/
# Create project → Get API key

# 8. PostHog (Alternative to Mixpanel)
# Visit: https://posthog.com/
# Create project → Get key

# 9. Auth0 (Authentication)
# Visit: https://auth0.com/
# Create application → Get credentials
```

---

## 🔧 **Configuration Examples**

### **Frontend Configuration**
```typescript
// lib/api-config.ts
export const apiConfig = {
  alchemy: {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: process.env.NEXT_PUBLIC_ALCHEMY_NETWORK || 'polygon-mainnet'
  },
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
  },
  pinata: {
    apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    secretKey: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
  }
}
```

### **Backend Configuration**
```javascript
// config/apis.js
module.exports = {
  alchemy: {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: process.env.ALCHEMY_NETWORK
  },
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    secretKey: process.env.PINATA_SECRET_KEY
  },
  mongodb: {
    uri: process.env.MONGODB_URI
  }
}
```

---

## 🧪 **Testing Your APIs**

### **Automated Testing**
```bash
# Run the API testing script
node scripts/test-api-keys.js

# Or use npm script
npm run test:apis
```

### **Manual Testing**
```typescript
// Test individual APIs
const testAlchemy = async () => {
  const response = await fetch(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
  return response.ok
}
```

---

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **API Key Not Working**
- ✅ Check if the key is correctly set in environment files
- ✅ Verify the key format matches the service requirements
- ✅ Ensure the key has the correct permissions/scopes

#### **Rate Limiting**
- ✅ Check your usage against the service limits
- ✅ Implement exponential backoff for retries
- ✅ Consider upgrading to a paid plan

#### **Network Issues**
- ✅ Check your internet connection
- ✅ Verify the API endpoints are accessible
- ✅ Check for firewall or proxy issues

### **Debug Mode**
```env
# Enable debug logging
NEXT_PUBLIC_ENABLE_DEBUG=true
LOG_LEVEL=debug
```

---

## 📚 **Additional Resources**

### **Documentation Links**
- [Alchemy Documentation](https://docs.alchemy.com/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [Tally Documentation](https://docs.tally.xyz/)
- [World ID Documentation](https://docs.worldcoin.org/world-id)

### **Community Support**
- [Discord Community](https://discord.gg/civicdao)
- [GitHub Issues](https://github.com/civicdao/issues)
- [Documentation Site](https://docs.civicdao.com)

---

## 🎯 **Next Steps**

1. **Choose your API stack** based on your needs and budget
2. **Create accounts** and get API keys for your chosen services
3. **Update environment variables** with your actual keys
4. **Test your configuration** using the provided testing script
5. **Implement API integrations** in your code
6. **Monitor usage and costs** to optimize your setup

Your Civic DAO will be powered by the most reliable and feature-rich APIs in the Web3 ecosystem! 🏛️✨
