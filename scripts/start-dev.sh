#!/bin/bash

# Civic DAO Development Server Startup Script
# This script starts all development servers

set -e

echo "🚀 Starting Civic DAO development servers..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    print_status "Backend started on http://localhost:3001 (PID: $BACKEND_PID)"
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    print_status "Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)"
}

# Function to start blockchain node (optional)
start_blockchain() {
    read -p "Do you want to start a local blockchain node? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Starting local blockchain node..."
        cd contracts
        npx hardhat node &
        BLOCKCHAIN_PID=$!
        cd ..
        print_status "Blockchain node started on http://localhost:8545 (PID: $BLOCKCHAIN_PID)"
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$BLOCKCHAIN_PID" ]; then
        kill $BLOCKCHAIN_PID 2>/dev/null || true
    fi
    print_status "All servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main function
main() {
    echo "🏛️  Civic DAO Development Environment"
    echo "====================================="
    
    # Check if dependencies are installed
    if [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
        print_warning "Dependencies not installed. Run 'npm run install:all' first."
        exit 1
    fi
    
    # Start blockchain node (optional)
    start_blockchain
    
    # Start backend
    start_backend
    
    # Wait a moment for backend to start
    sleep 2
    
    # Start frontend
    start_frontend
    
    print_status "🎉 All servers started successfully!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:3001"
    if [ ! -z "$BLOCKCHAIN_PID" ]; then
        print_status "Blockchain: http://localhost:8545"
    fi
    print_status "Press Ctrl+C to stop all servers"
    
    # Wait for user to stop
    wait
}

# Run main function
main "$@"
