// pages/api/diag.js
export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  try {
    const have = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    let stripePriceOk = false;
    let stripeMsg = null;

    if (have.STRIPE_SECRET_KEY && have.STRIPE_PRICE_ID) {
      try {
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2024-06-20',
        });
        const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID);
        stripePriceOk = !!price?.id;
      } catch (e) {
        stripeMsg = e?.message || String(e);
      }
    }

    return res.status(200).json({
      ok: true,
      env_present: have,
      stripe_price_ok: stripePriceOk,
      stripe_note: stripeMsg,
      runtime: process.version,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
