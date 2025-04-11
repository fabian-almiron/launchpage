import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
