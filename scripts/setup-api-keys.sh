#!/bin/bash

# 🚀 Civic DAO - API Keys Setup Script
# This script helps you configure all the required API keys for the Civic DAO project

echo "🏛️ Welcome to Civic DAO API Keys Setup!"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to prompt for API key
prompt_api_key() {
    local key_name=$1
    local description=$2
    local url=$3
    local is_required=${4:-false}
    
    echo -e "${BLUE}📋 $description${NC}"
    if [ ! -z "$url" ]; then
        echo -e "${YELLOW}   Setup URL: $url${NC}"
    fi
    
    if [ "$is_required" = true ]; then
        echo -e "${RED}   ⚠️  REQUIRED${NC}"
    else
        echo -e "${YELLOW}   ℹ️  Optional${NC}"
    fi
    
    read -p "   Enter your $key_name: " api_key
    
    if [ ! -z "$api_key" ]; then
        echo -e "${GREEN}   ✅ $key_name configured${NC}"
        echo "$key_name=$api_key" >> .env.local
    else
        if [ "$is_required" = true ]; then
            echo -e "${RED}   ❌ $key_name is required but not provided${NC}"
            return 1
        else
            echo -e "${YELLOW}   ⏭️  Skipping $key_name${NC}"
        fi
    fi
    echo ""
}

# Function to create environment files
create_env_files() {
    echo -e "${BLUE}📁 Creating environment files...${NC}"
    
    # Frontend .env.local
    if [ ! -f "frontend/.env.local" ]; then
        cp frontend/env.example frontend/.env.local
        echo -e "${GREEN}✅ Created frontend/.env.local${NC}"
    else
        echo -e "${YELLOW}⚠️  frontend/.env.local already exists${NC}"
    fi
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cp backend/env.example backend/.env
        echo -e "${GREEN}✅ Created backend/.env${NC}"
    else
        echo -e "${YELLOW}⚠️  backend/.env already exists${NC}"
    fi
    
    # Contracts .env
    if [ ! -f "contracts/.env" ]; then
        cp contracts/env.example contracts/.env
        echo -e "${GREEN}✅ Created contracts/.env${NC}"
    else
        echo -e "${YELLOW}⚠️  contracts/.env already exists${NC}"
    fi
    
    echo ""
}

# Function to setup blockchain APIs
setup_blockchain_apis() {
    echo -e "${BLUE}⛓️  Blockchain & Web3 APIs${NC}"
    echo "================================"
    
    # Alchemy (Primary)
    prompt_api_key "NEXT_PUBLIC_ALCHEMY_API_KEY" "Alchemy API Key (Primary blockchain provider)" "https://www.alchemy.com/" true
    
    # Infura (Alternative)
    prompt_api_key "NEXT_PUBLIC_INFURA_KEY" "Infura API Key (Alternative blockchain provider)" "https://infura.io/" false
    
    # WalletConnect
    prompt_api_key "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID" "WalletConnect Project ID" "https://cloud.walletconnect.com/" true
}

# Function to setup governance APIs
setup_governance_apis() {
    echo -e "${BLUE}🏛️  Governance & DAO APIs${NC}"
    echo "================================"
    
    # Tally
    prompt_api_key "NEXT_PUBLIC_TALLY_API_KEY" "Tally API Key (Governance analytics)" "https://www.tally.xyz/" false
    prompt_api_key "NEXT_PUBLIC_TALLY_DAO_ID" "Tally DAO ID" "" false
    
    # Snapshot (Alternative)
    prompt_api_key "NEXT_PUBLIC_SNAPSHOT_API_URL" "Snapshot API URL" "https://snapshot.org/" false
    prompt_api_key "NEXT_PUBLIC_SNAPSHOT_SPACE_ID" "Snapshot Space ID" "" false
}

# Function to setup identity APIs
setup_identity_apis() {
    echo -e "${BLUE}🔐 Identity & ZK-Proof APIs${NC}"
    echo "================================"
    
    # World ID
    prompt_api_key "NEXT_PUBLIC_WORLD_ID_APP_ID" "World ID App ID" "https://worldcoin.org/world-id" false
    prompt_api_key "NEXT_PUBLIC_WORLD_ID_ACTION_ID" "World ID Action ID" "" false
    
    # Semaphore (Alternative)
    prompt_api_key "NEXT_PUBLIC_SEMAPHORE_GROUP_ID" "Semaphore Group ID" "https://semaphore.appliedzkp.org/" false
    prompt_api_key "NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS" "Semaphore Contract Address" "" false
}

# Function to setup storage APIs
setup_storage_apis() {
    echo -e "${BLUE}📁 Decentralized Storage APIs${NC}"
    echo "================================"
    
    # Pinata (Primary)
    prompt_api_key "NEXT_PUBLIC_PINATA_API_KEY" "Pinata API Key" "https://www.pinata.cloud/" false
    prompt_api_key "NEXT_PUBLIC_PINATA_SECRET_KEY" "Pinata Secret Key" "" false
    
    # Web3.Storage (Alternative)
    prompt_api_key "NEXT_PUBLIC_WEB3_STORAGE_TOKEN" "Web3.Storage Token" "https://web3.storage/" false
}

# Function to setup analytics APIs
setup_analytics_apis() {
    echo -e "${BLUE}📊 Analytics & Monitoring APIs${NC}"
    echo "================================"
    
    # Mixpanel
    prompt_api_key "NEXT_PUBLIC_MIXPANEL_TOKEN" "Mixpanel Token" "https://mixpanel.com/" false
    
    # PostHog (Alternative)
    prompt_api_key "NEXT_PUBLIC_POSTHOG_KEY" "PostHog Key" "https://posthog.com/" false
    
    # Google Analytics
    prompt_api_key "NEXT_PUBLIC_GOOGLE_ANALYTICS_ID" "Google Analytics ID" "https://analytics.google.com/" false
}

# Function to setup security APIs
setup_security_apis() {
    echo -e "${BLUE}🔒 Security & Authentication APIs${NC}"
    echo "================================"
    
    # Auth0
    prompt_api_key "NEXT_PUBLIC_AUTH0_DOMAIN" "Auth0 Domain" "https://auth0.com/" false
    prompt_api_key "NEXT_PUBLIC_AUTH0_CLIENT_ID" "Auth0 Client ID" "" false
    prompt_api_key "NEXT_PUBLIC_AUTH0_AUDIENCE" "Auth0 Audience" "" false
}

# Function to setup backend APIs
setup_backend_apis() {
    echo -e "${BLUE}🖥️  Backend Configuration${NC}"
    echo "================================"
    
    # Database
    prompt_api_key "MONGODB_URI" "MongoDB Connection String" "https://www.mongodb.com/" false
    prompt_api_key "REDIS_URL" "Redis Connection String" "https://redis.io/" false
    
    # Email Services
    prompt_api_key "SENDGRID_API_KEY" "SendGrid API Key" "https://sendgrid.com/" false
    prompt_api_key "MAILGUN_API_KEY" "Mailgun API Key" "https://www.mailgun.com/" false
    
    # Monitoring
    prompt_api_key "SENTRY_DSN" "Sentry DSN" "https://sentry.io/" false
}

# Function to setup contract APIs
setup_contract_apis() {
    echo -e "${BLUE}📜 Smart Contract APIs${NC}"
    echo "================================"
    
    # Block Explorer APIs
    prompt_api_key "POLYGONSCAN_API_KEY" "Polygonscan API Key" "https://polygonscan.com/" false
    prompt_api_key "ETHERSCAN_API_KEY" "Etherscan API Key" "https://etherscan.io/" false
    prompt_api_key "ARBISCAN_API_KEY" "Arbiscan API Key" "https://arbiscan.io/" false
}

# Main setup function
main() {
    echo -e "${GREEN}🚀 Starting API Keys Setup...${NC}"
    echo ""
    
    # Create environment files
    create_env_files
    
    # Setup different categories of APIs
    setup_blockchain_apis
    setup_governance_apis
    setup_identity_apis
    setup_storage_apis
    setup_analytics_apis
    setup_security_apis
    setup_backend_apis
    setup_contract_apis
    
    echo -e "${GREEN}🎉 API Keys Setup Complete!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Review your environment files:"
    echo "   - frontend/.env.local"
    echo "   - backend/.env"
    echo "   - contracts/.env"
    echo ""
    echo "2. Update any placeholder values with your actual API keys"
    echo ""
    echo "3. Test your configuration by running:"
    echo "   npm run test:apis"
    echo ""
    echo -e "${GREEN}🏛️ Your Civic DAO is ready to go!${NC}"
}

# Run the main function
main
