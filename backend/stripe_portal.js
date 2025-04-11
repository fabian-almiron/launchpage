import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

router.post('/create-customer-portal-session', async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch user from the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ error: 'User or Stripe customer not found' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${FRONTEND_URL}/dashboard.html`,
    });

    res.json({ url: portalSession.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
