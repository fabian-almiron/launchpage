import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Domain resolution middleware - must be before other routes
app.use(async (req, res, next) => {
  const hostname = req.hostname;
  
  // Skip for localhost or IP addresses
  if (hostname === 'localhost' || hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/) || hostname.includes('example.com')) {
    return next();
  }
  
  try {
    // Check if this hostname matches any of our custom domains
    const domain = await prisma.domain.findUnique({
      where: { domain: hostname },
      include: { page: true }
    });
    
    if (domain && domain.status === 'live') {
      // If found, attach the page data to the request for later use
      req.customDomain = domain;
      req.pageData = domain.page;
    }
  } catch (error) {
    console.error('Error in domain middleware:', error);
  }
  
  next();
});

// Route to serve pages for custom domains
app.get('/', async (req, res, next) => {
  // If this request came through a custom domain and we have page data
  if (req.customDomain && req.pageData) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${req.pageData.title}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          ${req.pageData.content}
        </body>
      </html>
    `);
  }
  
  // Otherwise, continue to regular routes
  next();
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import { register, login, authMiddleware, getCurrentUserPlan } from './auth.js';
import { syncToWP } from './sync.js';

app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/deploy/wp', authMiddleware, syncToWP);
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello, ${req.user.email}` });
});

import stripeRoutes from './stripe.js';
import webhookRoutes from './webhooks.js';

app.use('/api/stripe', stripeRoutes);
app.use('/api', webhookRoutes);

app.get('/api/protected', authMiddleware, getCurrentUserPlan);

import stripePortalRoute from './stripe_portal.js';
app.use('/api/stripe', stripePortalRoute);

import teamRoutes from './teams.js';
app.use('/api', teamRoutes);

import inviteRoutes from './invites.js';
app.use('/api', inviteRoutes);

import magicRoutes from './magic.js';
app.use('/api', magicRoutes);

import resendRoute from './resend.js';
app.use('/api', resendRoute);

import setPasswordRoute from './set-password.js';
app.use('/api', setPasswordRoute);

import resetRoutes from './reset.js';
app.use('/api', resetRoutes);

import teamUserRoutes from './team-users.js';
app.use('/api', teamUserRoutes);

import updateRoleRoute from './update-role.js';
app.use('/api', updateRoleRoute);

import pageRoutes from './pages.js';
app.use('/api', pageRoutes);

import domainRoutes from './domains.js';
app.use('/api', domainRoutes);
