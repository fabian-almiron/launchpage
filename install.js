#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing LaunchPage Builder...');

// Create dist directory if it doesn't exist
try {
  const distDir = path.join(process.cwd(), 'frontend/public/dist');
  if (!fs.existsSync(distDir)) {
    console.log('📁 Creating dist directory...');
    fs.mkdirSync(distDir, { recursive: true });
  }
} catch (err) {
  console.error('⚠️ Error creating dist directory:', err);
}

// Copy environment file if it doesn't exist
try {
  if (!fs.existsSync(path.join(process.cwd(), 'backend/.env'))) {
    console.log('📄 Creating environment file...');
    fs.copyFileSync(
      path.join(process.cwd(), '.env.example'),
      path.join(process.cwd(), 'backend/.env')
    );
  }
} catch (err) {
  console.error('⚠️ Error creating environment file:', err);
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
  execSync('npm run css', { stdio: 'inherit' });
} catch (err) {
  console.error('⚠️ Error building CSS:', err);
  process.exit(1);
}

console.log(`
✅ LaunchPage Builder has been successfully installed!

To start the application:
> npm start

Then visit: http://localhost:8081 in your browser.

Documentation: README.md
`); 