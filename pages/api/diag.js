// pages/api/diag.js
import OpenAI from 'openai';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // What env vars are present (booleans only—safe to expose)
  const env_present = {
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
    SUPABASE_URL:
      !!process.env.NEXT_PUBLIC_SUPABASE_URL || !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    LLM_MODEL: !!process.env.LLM_MODEL,
  };

  // Optional: verify your Stripe price id really exists
  let stripe_price_ok = null;
  let stripe_note = null;
  try {
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID) {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
      });
      const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID);
      stripe_price_ok = !!price?.id;
    }
  } catch (e) {
    stripe_price_ok = false;
    stripe_note = String(e?.message || e);
  }

  // Check OpenAI access and model availability
  let model_ok = null;
  try {
    if (process.env.OPENAI_API_KEY) {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const model = process.env.LLM_MODEL || 'gpt-4o-mini';
      await client.responses.create({
        model,
        input: [{ role: 'user', content: 'ping' }],
      });
      model_ok = true;
    }
  } catch (e) {
    model_ok = String(e?.message || e);
  }

  return res.status(200).json({
    ok: true,
    env_present,
    stripe_price_ok,
    stripe_note,
    model_ok,
    runtime: `v${process.versions.node}`,
  });
}
