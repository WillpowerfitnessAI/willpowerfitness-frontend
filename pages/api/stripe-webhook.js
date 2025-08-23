// /pages/api/stripe-webhook.js
import Stripe from 'stripe';
import { buffer } from 'micro';
import { getAdminClient } from '../../lib/supabaseAdmin';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verify failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email =
      session?.metadata?.email ||
      session?.customer_details?.email ||
      session?.customer_email;

    if (email) {
      try {
        const supabase = getAdminClient();

        // Create a magic link
        const { data, error } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email
        });
        if (error) throw error;

        const link = data?.properties?.action_link;
        // Send via Resend HTTP API (no SDK)
        if (process.env.RESEND_API_KEY && process.env.RESEND_FROM && link) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: process.env.RESEND_FROM,
              to: email,
              subject: 'Your WillpowerFitness AI login',
              html: `<p>Welcome! Click to sign in:</p><p><a href="${link}">${link}</a></p>`
            })
          });
        }
      } catch (e) {
        console.warn('magic-link/send skipped:', e?.message || e);
      }
    }
  }

  return res.json({ received: true });
}
