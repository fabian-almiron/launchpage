import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, requireRole } from './auth.js';
import godaddy from './services/godaddy.js';
import ssl from './services/ssl.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all domains for a team
router.get('/domains', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { team: true }
    });

    if (!user.teamId) {
      return res.status(400).json({ error: 'User not associated with a team' });
    }

    const domains = await prisma.domain.findMany({
      where: { teamId: user.teamId },
      include: { page: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: error.message });
  }
});

// List domains from GoDaddy account
router.get('/domains/godaddy', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const domains = await godaddy.listDomains();
    res.json(domains);
  } catch (error) {
    console.error('Error listing GoDaddy domains:', error);
    res.status(500).json({ error: error.message });
  }
});

// Connect a domain to a page
router.post('/domains/connect', authMiddleware, requireRole(['editor', 'admin']), async (req, res) => {
  const { domain, pageId, recordType = 'A' } = req.body;
  const userId = req.user.userId;

  if (!domain || !pageId) {
    return res.status(400).json({ error: 'Domain and page ID are required' });
  }

  try {
    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }

    // Get user's team
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { team: true }
    });

    if (!user.teamId) {
      return res.status(400).json({ error: 'User not associated with a team' });
    }

    // Check if page exists and belongs to the team
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        teamId: user.teamId
      }
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found or not accessible' });
    }

    // Check if domain already exists
    const existingDomain = await prisma.domain.findUnique({
      where: { domain }
    });

    if (existingDomain) {
      return res.status(400).json({ error: 'Domain is already connected to a page' });
    }

    // Set up DNS record on GoDaddy
    // For this example, we'll point to a fixed hostname, but in production
    // you'd use your actual app hostname like 'builder.yourdomain.com'
    const targetHostname = process.env.APP_HOSTNAME || 'builder.example.com';
    
    try {
      await godaddy.addDnsRecord(
        domain, 
        recordType, 
        '@', // Root domain
        recordType === 'A' 
          ? process.env.SERVER_IP || '123.123.123.123' // For A record (placeholder IP)
          : targetHostname // For CNAME record
      );
    } catch (dnsError) {
      console.error('DNS error:', dnsError);
      // Continue creating the domain record but mark it as pending
      // This allows users to manually set up DNS if the API fails
    }

    // Create domain record
    const domainRecord = await prisma.domain.create({
      data: {
        domain,
        teamId: user.teamId,
        pageId,
        status: 'pending',
        recordType
      }
    });

    res.status(201).json({
      ...domainRecord,
      message: 'Domain connection initiated. DNS propagation may take up to 48 hours.'
    });
  } catch (error) {
    console.error('Error connecting domain:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify domain connection status
router.get('/domains/:id/verify', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Get domain with team info
    const domain = await prisma.domain.findFirst({
      where: {
        id,
        team: {
          users: {
            some: { id: userId }
          }
        }
      },
      include: { team: true }
    });

    if (!domain) {
      return res.status(404).json({ error: 'Domain not found or not accessible' });
    }

    // In a real implementation, you would check if the DNS has propagated
    // For this example, we'll simulate a verification process
    const isVerified = await checkDomainDNS(domain.domain, domain.recordType);

    if (isVerified) {
      // Update domain status
      const updatedDomain = await prisma.domain.update({
        where: { id },
        data: { status: 'verified' }
      });

      // Trigger SSL certificate generation
      try {
        // This is an async operation that might take time, so we don't await it here
        ssl.generateCertificate(domain.domain)
          .catch(err => console.error('SSL generation error:', err));
        
        return res.json({
          ...updatedDomain,
          message: 'Domain verified successfully! SSL certificate is being generated.'
        });
      } catch (sslError) {
        console.error('Error initiating SSL generation:', sslError);
        return res.json({
          ...updatedDomain,
          message: 'Domain verified, but SSL certificate generation failed. Please try again later.'
        });
      }
    }

    return res.json({
      ...domain,
      message: 'Domain verification is still pending. DNS propagation may take up to 48 hours.'
    });
  } catch (error) {
    console.error('Error verifying domain:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate SSL certificate for a verified domain
router.post('/domains/:id/ssl', authMiddleware, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;
  
  try {
    const domain = await prisma.domain.findUnique({
      where: { id }
    });
    
    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    if (domain.status !== 'verified') {
      return res.status(400).json({ error: 'Domain must be verified before generating SSL certificate' });
    }
    
    // Generate SSL certificate
    ssl.generateCertificate(domain.domain)
      .then(result => {
        console.log('SSL certificate generated:', result);
      })
      .catch(err => {
        console.error('SSL generation error:', err);
      });
    
    res.json({ message: 'SSL certificate generation initiated. This may take a few minutes.' });
  } catch (error) {
    console.error('Error generating SSL certificate:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to check if DNS has propagated
async function checkDomainDNS(domain, recordType) {
  try {
    const dns = require('dns').promises;
    const targetHostname = process.env.APP_HOSTNAME || 'builder.example.com';
    const serverIP = process.env.SERVER_IP || '123.123.123.123';
    
    if (recordType === 'A') {
      // For A records, check if the domain resolves to our server IP
      const addresses = await dns.resolve4(domain);
      return addresses.includes(serverIP);
    } else if (recordType === 'CNAME') {
      // For CNAME records, check if the domain points to our target hostname
      const cname = await dns.resolveCname(domain);
      return cname.includes(targetHostname);
    }
    
    return false;
  } catch (error) {
    console.error(`DNS check failed for ${domain}:`, error);
    return false;
  }
}

// Delete a domain connection
router.delete('/domains/:id', authMiddleware, requireRole(['editor', 'admin']), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Check if domain exists and user has access
    const domain = await prisma.domain.findFirst({
      where: {
        id,
        team: {
          users: {
            some: { id: userId }
          }
        }
      }
    });

    if (!domain) {
      return res.status(404).json({ error: 'Domain not found or not accessible' });
    }

    // Delete domain
    await prisma.domain.delete({
      where: { id }
    });

    res.json({ message: 'Domain disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting domain:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 