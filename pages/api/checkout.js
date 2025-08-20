// pages/api/checkout.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/subscribe`,
    });

    // If this request came from a normal link or form, just redirect to Stripe.
    const accept = req.headers.accept || '';
    const wantsJson =
      accept.includes('application/json') ||
      (req.headers['content-type'] || '').includes('application/json');

    if (!wantsJson) {
      return res.redirect(303, session.url);
    }

    // If it was an XHR/fetch expecting JSON, return the URL.
    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('Stripe checkout error:', e);
    return res.status(500).json({ error: 'checkout_failed' });
  }
}
