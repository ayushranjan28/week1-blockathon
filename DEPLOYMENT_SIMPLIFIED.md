# 🚀 Civic DAO - Simplified Deployment Guide

## ✅ **Minimal API Keys Required**

Your Civic DAO can be deployed with **ONLY 1 API key**:

### **🔑 Required API Key:**
- **WalletConnect Cloud Project ID** - Connects ALL wallets with single key

### **📋 Optional APIs (Can be added later):**
- **Pinata IPFS** - For file storage (if needed)
- **Backend API** - Your own backend service

---

## 🚀 **Quick Vercel Deployment**

### **Step 1: Get WalletConnect Project ID**
1. Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create account → Create new project
3. Copy your **Project ID**

### **Step 2: Configure Environment Variables**
Create `frontend/.env.local`:
```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Civic DAO
NEXT_PUBLIC_APP_URL=https://civic-dao.vercel.app

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology

# WalletConnect Cloud (REQUIRED)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here

# Contract Addresses (Update after deployment)
NEXT_PUBLIC_CIVIC_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CIVIC_DAO_ADDRESS=0x0000000000000000000000000000000000000000

# Backend API (Optional - for full functionality)
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### **Step 3: Deploy to Vercel**
```bash
cd frontend
npm install
npm run build
npx vercel --prod
```

### **Step 4: Configure Vercel Environment Variables**
In Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_CIVIC_TOKEN_ADDRESS` (after contract deployment)
- `NEXT_PUBLIC_CIVIC_DAO_ADDRESS` (after contract deployment)

---

## 🎯 **What Works Without Backend:**
- ✅ Wallet connection (all wallets)
- ✅ Smart contract interaction
- ✅ Voting on proposals
- ✅ Creating proposals
- ✅ ZK identity verification (mock)
- ✅ Real-time polling
- ✅ Responsive UI

## 🔧 **What Requires Backend:**
- ❌ User profiles
- ❌ Proposal comments
- ❌ Email notifications
- ❌ Advanced analytics

---

## 📱 **Supported Wallets (Single API Key):**
- MetaMask
- Coinbase Wallet
- Trust Wallet
- Rainbow Wallet
- WalletConnect compatible wallets
- **300+ wallets total**

---

## 💰 **Cost Breakdown:**
- **WalletConnect Cloud**: FREE
- **Vercel**: FREE (hobby plan)
- **Polygon Testnet**: FREE
- **Total**: $0/month for MVP

---

## 🚀 **Deployment Commands:**

### **Windows (PowerShell):**
```powershell
cd frontend
npm install
npm run build
npx vercel --prod
```

### **Linux/Mac:**
```bash
cd frontend
npm install
npm run build
npx vercel --prod
```

---

## ✅ **Success Checklist:**
- [ ] WalletConnect Project ID configured
- [ ] Smart contracts deployed
- [ ] Contract addresses updated
- [ ] Vercel deployment successful
- [ ] Wallet connection working
- [ ] Voting functionality tested

---

**🎉 Your Civic DAO will be live with just 1 API key!**
