# Domain Management UI

This directory contains the frontend components for managing custom domains in the LaunchPage Builder application.

## Overview

The domain management UI allows agencies to:

1. Connect custom domains to specific landing pages
2. Choose between A record and CNAME record types
3. Monitor domain connection status
4. Verify domain connections
5. Disconnect domains when needed

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- Backend server running (see backend/README.md)

### Installation

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Build Tailwind CSS:
   ```
   npm run build:css
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Usage Guide

### Accessing the Domain Manager

1. Log in to the application
2. Click on "Domains" in the main navigation
3. Alternatively, from the Pages tab, click the "Manage Domains" button

### Connecting a New Domain

1. In the Domain Manager, enter a domain name (e.g., `example.com`)
2. Select the page you want to connect the domain to
3. Choose the DNS record type:
   - **A Record**: Points directly to the server's IP address
   - **CNAME Record**: Points to the application hostname
4. Click "Connect Domain"

### Verifying Domain Connection

1. After connecting a domain, it will initially show a "Pending" status
2. Make sure your domain's DNS settings are configured with GoDaddy
3. DNS propagation can take up to 48 hours
4. Click the "Verify" button to check if the domain is properly configured
5. Once verified, the system will automatically generate an SSL certificate

### Disconnecting a Domain

1. In the domain list, find the domain you want to disconnect
2. Click the "Disconnect" button
3. Confirm the action when prompted

## Troubleshooting

### Common Issues

- **Domain not connecting**: Make sure your GoDaddy API credentials are valid
- **Verification failing**: DNS propagation can take up to 48 hours
- **SSL certificate not generating**: Ensure your server is publicly accessible

### Support

If you encounter any issues, contact support at support@launchpage.example.com or refer to the main documentation at [DOMAIN_MANAGEMENT.md](../DOMAIN_MANAGEMENT.md). 