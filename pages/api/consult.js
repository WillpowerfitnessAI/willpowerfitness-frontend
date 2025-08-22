// /pages/api/consult.js
export const config = { runtime: 'nodejs' };

import { getAdminClient } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  // Health check for GET (helps you test /api/consult in the browser)
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, route: '/api/consult', method: 'GET' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const {
    name, email, phone,
    address_line1, address_line2, city, state, postal_code,
    trial // boolean or "2" if you’re passing ?trial=2
  } = req.body || {};

  if (!email) return res.status(400).json({ ok: false, error: 'email required' });

  try {
    const supabase = getAdminClient();

    // 1) Upsert into leads (pre-signup)
    const lead = {
      email: (email || '').trim().toLowerCase(),
      name: name || null,
      phone: phone || null,
      address_line1: address_line1 || null,
      address_line2: address_line2 || null,
      city: city || null,
      state: state || null,
      postal_code: postal_code || null,
      source: trial ? 'trial' : 'paid'
    };

    const { error: upsertErr } = await supabase
      .from('leads')
      .upsert(lead, { onConflict: 'email' });

    if (upsertErr) throw upsertErr;

    // 2) Fire-and-forget welcome email (Resend via fetch; no SDK import)
    await maybeSendWelcomeEmail(lead);

    // 3) Tell frontend where to go next (your Stripe flow)
    const next = trial ? '/api/start-checkout?trial=2' : '/api/start-checkout';
    return res.status(200).json({ ok: true, next });
  } catch (e) {
    console.error('consult error:', e);
    return res.status(500).json({ ok: false, error: String((e && e.message) || e) });
  }
}

// --- Email via Resend HTTP API (no 'resend' package needed) ---
async function maybeSendWelcomeEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM || 'WillpowerFitness AI <noreply@send.willpowerfitnessai.com>';

  if (!apiKey || !lead?.email) return; // quietly skip if not configured

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: lead.email,
        subject: 'Welcome to WillpowerFitness AI',
        html: `
          <p>Hi ${lead.name || ''},</p>
          <p>Welcome aboard. Your consult is saved — next step is checkout to activate coaching.</p>
          <p>We’ll personalize programming, nutrition, and accountability.</p>
          <p>– WillpowerFitness AI</p>
        `,
      }),
    });
  } catch (e) {
    console.warn('welcome email skipped:', e?.message || e);
  }
}

/*
NOTE: Twilio SMS removed for now so the build never looks for the 'twilio' package.
When you’re ready later, we can add an HTTP call or optional dynamic import gated by env vars.
*/

