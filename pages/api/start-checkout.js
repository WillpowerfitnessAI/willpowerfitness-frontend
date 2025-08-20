// pages/api/start-checkout.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const origin = req.headers.origin || 'https://app.willpowerfitnessai.com';
  const trialDays = Number(req.query.trial) || 0;

  try {
    const { name, email, phone, address } = req.body || {};
    if (!email || !name || !address?.line1 || !address?.city || !address?.state || !address?.postal_code) {
      return res.status(400).json({ error: 'missing_required_fields' });
    }

    // 1) Upsert lead in Supabase (optional)
    try {
      await supabase
        .from('leads')
        .upsert({
          email,
          name,
          phone,
          address_line1: address.line1,
          address_line2: address.line2 || null,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          source: trialDays > 0 ? 'trial' : 'subscribe',
        }, { onConflict: 'email' });
    } catch (e) {
      console.warn('leads upsert warning:', e?.message || e);
    }

    // 2) Find or create Stripe customer
    let customerId;
    try {
      const existing = await stripe.customers.list({ email, limit: 1 });
      customerId = existing.data[0]?.id;
    } catch {}
    if (!customerId) {
      const c = await stripe.customers.create({ email, name, phone, address });
      customerId = c.id;
    } else {
      await stripe.customers.update(customerId, { name, phone, address });
    }

    // 3) Create the Checkout Session
    const subscription_data = {};
    if (trialDays > 0) {
      subscription_data.trial_period_days = trialDays;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscribe`,
      ...(Object.keys(subscription_data).length ? { subscription_data } : {}),
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('start-checkout error:', e);
    return res.status(500).json({ error: 'server_error' });
  }
}
