#!/bin/bash

# Create the dist directory if it doesn't exist
mkdir -p dist
mkdir -p frontend/public/dist

# Package the application
echo "📦 Packaging LaunchPage Builder..."
zip -r dist/launchpage-builder.zip frontend package.json README.md LICENSE install.js tailwind.config.js

echo "✅ Package created at dist/launchpage-builder.zip"
echo "You can install it elsewhere using one of these methods:"
echo "1. npm install launchpage-builder.zip"
echo "2. Extract the zip and run npm install" 