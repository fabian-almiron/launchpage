#!/bin/bash

echo "🚀 Starting LaunchPage Builder"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Setup the environment using the installer script
if [ ! -f backend/.env ]; then
    echo "⚠️ Running setup script to create necessary files..."
    node install.js
fi

# Build and start the containers
echo "🔄 Building and starting containers..."
docker-compose up --build -d

echo "✅ Application is now running!"
echo "🌐 Frontend: http://localhost:8081"
echo "🔌 Backend API: http://localhost:3001"
echo ""
echo "ℹ️ You can access the domain management functionality by clicking 'Connect Domain' in the page preview"
echo ""
echo "⚠️ To stop the application, run: docker-compose down" 