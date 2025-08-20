// pages/api/start-checkout.js
export const config = { runtime: 'nodejs' };

function missingEnv(...keys) {
  return keys.filter((k) => !process.env[k]);
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const origin = req.headers.origin || 'https://app.willpowerfitnessai.com';
  const trialDays = Number(req.query.trial) || 0;

  const need = missingEnv(
    'STRIPE_SECRET_KEY',
    'STRIPE_PRICE_ID',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  );
  if (need.length) {
    return res.status(500).json({ error: 'missing_env', missing: need });
  }

  try {
    // ✅ dynamic imports so the file can load on Vercel even if packages are quirky
    const { default: Stripe } = await import('stripe');
    const { createClient } = await import('@supabase/supabase-js');

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // pin an API version to avoid surprises
      apiVersion: '2024-06-20',
    });
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { name, email, phone, address } = req.body || {};
    if (
      !email ||
      !name ||
      !address?.line1 ||
      !address?.city ||
      !address?.state ||
      !address?.postal_code
    ) {
      return res.status(400).json({ error: 'missing_required_fields' });
    }

    // 1) Lead capture (non-blocking)
    try {
      await supabase.from('leads').upsert(
        {
          email,
          name,
          phone: phone || null,
          address_line1: address.line1,
          address_line2: address.line2 || null,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country || 'US',
          source: trialDays > 0 ? 'trial' : 'subscribe',
        },
        { onConflict: 'email' }
      );
    } catch (e) {
      console.warn('leads upsert warning:', e?.message || e);
    }

    // 2) Find or create Stripe customer
    let customerId;
    try {
      const existing = await stripe.customers.list({ email, limit: 1 });
      customerId = existing.data[0]?.id;
    } catch (e) {
      console.error('stripe.customers.list error:', e);
    }
    if (!customerId) {
      const c = await stripe.customers.create({
        email,
        name,
        phone: phone || undefined,
        address: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country || 'US',
        },
      });
      customerId = c.id;
    } else {
      await stripe.customers.update(customerId, {
        name,
        phone: phone || undefined,
        address: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country || 'US',
        },
      });
    }

    // 3) Create Checkout Session
    const subscription_data =
      trialDays > 0 ? { trial_period_days: trialDays } : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscribe`,
      ...(subscription_data ? { subscription_data } : {}),
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('start-checkout fatal:', e?.message || e);
    // Always respond JSON so the client can show a friendly message
    return res.status(500).json({
      error: 'server_error',
      message: e?.message || 'unknown_error',
    });
  }
}
