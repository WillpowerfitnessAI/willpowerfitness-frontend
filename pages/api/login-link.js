// pages/api/login-link.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const { email } = req.body || {};
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return res.status(400).json({ error: 'invalid_email' });
    }

    const origin = req.headers.origin || 'https://app.willpowerfitnessai.com';

    // 1) Check Stripe: customer with active/trialing sub
    const customers = await stripe.customers.list({ email, limit: 5 });
    const customer = customers.data[0];

    if (!customer) {
      return res.status(403).json({ error: 'not_subscribed' });
    }

    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 10,
    });

    const isMember = subs.data.some(s =>
      ['trialing', 'active', 'past_due'].includes(s.status)
    );

    if (!isMember) {
      return res.status(403).json({ error: 'not_subscribed' });
    }

    // 2) Generate a Supabase magic-link and return it
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${origin}/dashboard` },
    });
    if (error) throw error;

    const loginUrl =
      data?.properties?.action_link || data?.action_link || null;

    if (!loginUrl) {
      return res.status(500).json({ error: 'no_login_url' });
    }

    return res.status(200).json({ ok: true, login_url: loginUrl });
  } catch (e) {
    console.error('login-link error:', e);
    return res.status(500).json({ error: 'server_error' });
  }
}
