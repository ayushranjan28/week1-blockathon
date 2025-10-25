#!/bin/bash

# Civic DAO Vercel Deployment Script
echo "🚀 Starting Civic DAO deployment to Vercel..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ] || [ ! -d "app" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live on Vercel"
    echo "📝 Don't forget to configure environment variables in the Vercel dashboard"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
