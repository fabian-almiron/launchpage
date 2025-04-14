import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const execPromise = promisify(exec);
const prisma = new PrismaClient();

/**
 * Service to handle SSL certificate generation and renewal with Let's Encrypt
 */
class SSLService {
  constructor() {
    this.certbotPath = process.env.CERTBOT_PATH || 'certbot';
    this.sslDir = process.env.SSL_DIR || '/etc/letsencrypt/live';
    this.webRoot = process.env.WEB_ROOT || '/var/www/html';
    this.email = process.env.SSL_EMAIL || 'admin@example.com';
  }

  /**
   * Generate a new SSL certificate for a domain
   * @param {string} domain - The domain to generate certificate for
   * @returns {Promise<Object>} - The result of certificate generation
   */
  async generateCertificate(domain) {
    try {
      // Ensure domain is already verified in our system
      const domainRecord = await prisma.domain.findUnique({
        where: { domain }
      });

      if (!domainRecord || domainRecord.status !== 'verified') {
        throw new Error(`Domain ${domain} is not verified yet`);
      }

      // Use certbot to generate a certificate
      const command = `${this.certbotPath} certonly --webroot -w ${this.webRoot} -d ${domain} --email ${this.email} --agree-tos --non-interactive`;
      
      console.log(`Executing certbot command: ${command}`);
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr && !stderr.includes('Congratulations!')) {
        console.error(`Certbot error for ${domain}:`, stderr);
        throw new Error(`Failed to generate certificate: ${stderr}`);
      }
      
      // Update domain status to 'live' after successful certificate generation
      await prisma.domain.update({
        where: { domain },
        data: { status: 'live' }
      });
      
      console.log(`Certificate generated successfully for ${domain}`);
      return { success: true, domain, message: stdout };
    } catch (error) {
      console.error(`Error generating certificate for ${domain}:`, error);
      throw error;
    }
  }

  /**
   * Renew all SSL certificates
   * @returns {Promise<Object>} - The result of renewal operation
   */
  async renewCertificates() {
    try {
      const command = `${this.certbotPath} renew --quiet`;
      const { stdout, stderr } = await execPromise(command);
      
      console.log('Certbot renewal completed:', stdout);
      
      if (stderr && !stderr.includes('Congratulations!')) {
        console.error('Certbot renewal error:', stderr);
      }
      
      return { success: true, message: 'Certificate renewal process completed' };
    } catch (error) {
      console.error('Error renewing certificates:', error);
      throw error;
    }
  }

  /**
   * Check if a certificate exists for a domain
   * @param {string} domain - The domain to check
   * @returns {Promise<boolean>} - Whether the certificate exists
   */
  async certificateExists(domain) {
    const certPath = path.join(this.sslDir, domain, 'fullchain.pem');
    try {
      await fs.promises.access(certPath, fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new SSLService(); 