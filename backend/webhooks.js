import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email;
    const stripeCustomerId = session.customer;

    const priceId = session.metadata?.plan_id || 'free';
    const plan = priceId.includes('agency') ? 'agency' : priceId.includes('pro') ? 'pro' : 'free';

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.user.update({
          where: { email },
          data: {
            plan,
            stripeCustomerId
          }
        });
        console.log(`Updated ${email} to plan: ${plan} with customer ID: ${stripeCustomerId}`);
      }
    } catch (error) {
      console.error('Error updating user plan and Stripe ID:', error);
    }
  }

  res.json({ received: true });
});

export default router;
