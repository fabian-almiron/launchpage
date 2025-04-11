#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing LaunchPage Builder...');

// Create dist directory if it doesn't exist
try {
  if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
    fs.mkdirSync(path.join(process.cwd(), 'dist'));
  }
} catch (err) {
  console.error('⚠️ Error creating dist directory:', err);
}

// Install dependencies
try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
} catch (err) {
  console.error('⚠️ Error installing dependencies:', err);
  process.exit(1);
}

// Build CSS
try {
  console.log('🎨 Building CSS...');
  execSync('npm run build', { stdio: 'inherit' });
} catch (err) {
  console.error('⚠️ Error building CSS:', err);
  process.exit(1);
}

console.log(`
✅ LaunchPage Builder has been successfully installed!

To start the application:
> npm start

Then visit: http://localhost:3000 in your browser.

Documentation: README.md
`); 