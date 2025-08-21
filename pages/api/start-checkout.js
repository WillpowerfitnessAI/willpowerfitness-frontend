// pages/api/start-checkout.js
export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    name = '',
    email = '',
    phone = '',
    address_line1 = '',
    address_line2 = '',
    city = '',
    state = '',
    postal_code = '',
    trial = false, // boolean — send true for trial flow
    source = 'join',
  } = req.body || {};

  try {
    // --- sanity
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing STRIPE_SECRET_KEY');
    if (!process.env.STRIPE_PRICE_ID) throw new Error('Missing STRIPE_PRICE_ID');
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase env (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
    }
    if (!email) throw new Error('Email is required');

    // --- record lead (server-side) ---
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    await supabase
      .from('leads')
      .upsert([{
        email,
        name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        source,
      }], { onConflict: 'email' }); // email PK per our earlier table

    // --- Stripe Checkout session ---
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

    const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      // add 2-day free trial only when `trial` is true
      subscription_data: trial ? { trial_period_days: 2 } : undefined,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/join${trial ? '?trial=1' : ''}`,
      customer_email: email,
      allow_promotion_codes: false,
      metadata: { brand: 'WillpowerFitnessAI', trial: String(trial) },
      automatic_tax: { enabled: false },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('start-checkout error', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
