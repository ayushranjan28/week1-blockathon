#!/bin/bash

# Civic DAO Deployment Script
# This script deploys the entire Civic DAO application

set -e

echo "🚀 Starting Civic DAO deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git and try again."
        exit 1
    fi
    
    print_status "All dependencies are installed ✓"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install contract dependencies
    print_status "Installing contract dependencies..."
    cd contracts
    npm install
    cd ..
    
    print_status "All dependencies installed ✓"
}

# Deploy smart contracts
deploy_contracts() {
    print_status "Deploying smart contracts..."
    
    cd contracts
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Please copy env.example to .env and configure it."
        cp env.example .env
        print_warning "Please edit contracts/.env with your configuration and run the script again."
        exit 1
    fi
    
    # Compile contracts
    print_status "Compiling contracts..."
    npx hardhat compile
    
    # Deploy contracts
    print_status "Deploying to Polygon Amoy testnet..."
    npx hardhat run scripts/deploy.js --network amoy
    
    print_status "Contracts deployed successfully ✓"
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    
    # Check if .env.local file exists
    if [ ! -f .env.local ]; then
        print_warning ".env.local file not found. Creating from example..."
        cp env.example .env.local
        print_warning "Please edit frontend/.env.local with your configuration."
    fi
    
    # Build the application
    npm run build
    
    print_status "Frontend built successfully ✓"
    cd ..
}

# Build backend
build_backend() {
    print_status "Building backend..."
    
    cd backend
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from example..."
        cp env.example .env
        print_warning "Please edit backend/.env with your configuration."
    fi
    
    print_status "Backend ready for deployment ✓"
    cd ..
}

# Main deployment function
main() {
    echo "🏛️  Civic DAO Deployment Script"
    echo "================================"
    
    # Check dependencies
    check_dependencies
    
    # Install dependencies
    install_dependencies
    
    # Deploy contracts (optional)
    read -p "Do you want to deploy smart contracts? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_contracts
    fi
    
    # Build frontend
    build_frontend
    
    # Build backend
    build_backend
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Next steps:"
    echo "1. Update contract addresses in frontend/.env.local and backend/.env"
    echo "2. Start the development servers:"
    echo "   - Frontend: cd frontend && npm run dev"
    echo "   - Backend: cd backend && npm run dev"
    echo "3. Visit http://localhost:3000 to see your application"
}

# Run main function
main "$@"
