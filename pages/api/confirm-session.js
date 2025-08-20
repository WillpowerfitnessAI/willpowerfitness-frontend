// pages/api/confirm-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: 'missing_session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'customer'],
    });

    return res.status(200).json({
      status: session.status,                          // 'complete'
      payment_status: session.payment_status,          // e.g., 'paid' or 'no_payment_required'
      subscription_status: session.subscription?.status ?? null, // 'trialing', 'active', etc.
      trial_end: session.subscription?.trial_end ?? null,        // unix seconds (if trial)
      customer_email: session.customer_details?.email ?? null,
    });
  } catch (e) {
    return res.status(500).json({ error: 'retrieve_failed', message: e.message });
  }
}
