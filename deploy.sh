#!/bin/bash

# Reward Jar Deployment Script
echo "🚀 Starting Reward Jar deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Deploy backend
echo "🌐 Deploying backend to AWS..."
cd backend
npm run deploy

if [ $? -ne 0 ]; then
    echo "❌ Backend deployment failed!"
    exit 1
fi

cd ..

echo "✅ Deployment completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Deploy the frontend to your preferred hosting service"
echo "2. Update the REACT_APP_API_URL environment variable"
echo "3. Test the application"
echo ""
echo "📊 Backend API endpoints are now available!" 