// pages/api/checkout.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const origin = req.headers.origin || 'https://app.willpowerfitnessai.com';

    // Read trial from query (?trial=2). If not provided or invalid -> no trial.
    const trialDays = Number(req.query.trial);
    const subscription_data = {};
    if (!Number.isNaN(trialDays) && trialDays > 0) {
      subscription_data.trial_period_days = trialDays;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscribe`,
      // Only include subscription_data if we actually set anything
      ...(Object.keys(subscription_data).length ? { subscription_data } : {}),
    });

    // If the browser navigated here via link (GET) → send them straight to Stripe.
    const accepts = req.headers.accept || '';
    const wantsJson =
      accepts.includes('application/json') ||
      (req.headers['content-type'] || '').includes('application/json');

    if (req.method === 'GET' && !wantsJson) {
      return res.redirect(303, session.url);
    }

    // For fetch/XHR (POST) return the session URL as JSON.
    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('Stripe checkout error:', e?.message || e);
    return res.status(500).json({ error: 'checkout_failed' });
  }
}

