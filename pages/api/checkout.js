// pages/api/checkout.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { intent } = req.body || {};
    const priceId = process.env.STRIPE_PRICE_MONTHLY_ID; // e.g. price_XXXX
    if (!priceId) return res.status(500).json({ error: 'missing_price' });

    const trialDays =
      intent === 'trial' ? parseInt(process.env.STRIPE_TRIAL_DAYS || '2', 10) : 0;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: trialDays > 0 ? { trial_period_days: trialDays } : undefined,
      // Stripe will collect email and create/attach a Customer automatically
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'stripe_error' });
  }
}
