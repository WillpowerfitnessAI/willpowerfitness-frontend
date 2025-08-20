// pages/api/checkout.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/subscribe`,
    });

    // If a link hits this with GET, send the user straight to Stripe
    if (req.method === 'GET') {
      return res.redirect(303, session.url);
    }

    // If your frontend fetches POST, return JSON
    if (req.method === 'POST') {
      return res.status(200).json({ url: session.url });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end('Method Not Allowed');
  } catch (e) {
    console.error('checkout error:', e);
    return res.status(500).json({ error: 'checkout_failed' });
  }
}
