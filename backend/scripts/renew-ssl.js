import ssl from '../services/ssl.js';

/**
 * Script to automatically renew SSL certificates
 * This script can be run on a cron job (e.g., daily or weekly)
 * Example cron: 0 0 * * 0 node /path/to/renew-ssl.js
 */
async function renewCertificates() {
  console.log('Starting SSL certificate renewal process...');
  
  try {
    const result = await ssl.renewCertificates();
    console.log('SSL renewal completed successfully:', result);
  } catch (error) {
    console.error('Error renewing SSL certificates:', error);
    process.exit(1);
  }
}

renewCertificates(); 