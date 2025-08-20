// /pages/api/diag.js
export const config = { runtime: 'nodejs' };

import OpenAI from 'openai';

export default async function handler(req, res) {
  const env_present = {
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_PRICE_ID: !!process.env.STRIPE_PRICE_ID,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    LLM_MODEL: process.env.LLM_MODEL || null,
  };

  let model_ok = false;
  let model_note = null;

  if (env_present.OPENAI_API_KEY) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const testModel = process.env.LLM_MODEL || 'gpt-4o-mini'; // safe default
      await client.responses.create({ model: testModel, input: 'ping' });
      model_ok = true;
    } catch (e) {
      model_note = String(e?.message || e);
    }
  }

  return res.status(200).json({
    ok: true,
    env_present,
    model_ok,
    model_note,
    runtime: process.version,
  });
}
