import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:3000';

router.post('/create-checkout-session', async (req, res) => {
  const { email, plan } = req.body;

  const prices = {
    free: 'price_free_id',
    pro: 'price_pro_id',
    agency: 'price_agency_id'
  };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${YOUR_DOMAIN}/success?session_id=${session.id}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
