// /pages/api/consult.js
export const config = { runtime: 'nodejs' };

import { getAdminClient } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Simple GET probe helps when you hit /api/consult in the browser
    return res.status(200).json({ ok: true, route: '/api/consult', method: 'GET' });
  }

  const {
    name, email, phone,
    address_line1, address_line2, city, state, postal_code,
    trial // boolean or "2"
  } = req.body || {};

  if (!email) return res.status(400).json({ ok: false, error: 'email required' });

  try {
    const supabase = getAdminClient();

    // Upsert into leads
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

    // Fire-and-forget notifications
    await Promise.allSettled([
      maybeSendWelcomeEmail(lead),
      maybeSendWelcomeSMS(lead)
    ]);

    // Tell the client where to go next (your existing Stripe flow)
    const next = trial ? '/api/start-checkout?trial=2' : '/api/start-checkout';
    return res.status(200).json({ ok: true, next });
  } catch (e) {
    console.error('consult error:', e);
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}

/**
 * Email via Resend WITHOUT the SDK (so we don’t need the 'resend' package).
 */
async function maybeSendWelcomeEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ||
    'WillpowerFitness AI <noreply@send.willpowerfitnessai.com>';

  if (!apiKey || !lead?.email) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: lead.email,
        subject: 'Welcome to WillpowerFitness AI',
        html: `
          <p>Hi ${lead.name ? lead.name : ''},</p>
          <p>Welcome aboard. Your consult is saved — next step is checkout to activate coaching.</p>
          <p>We’ll personalize programming, nutrition, and accountability.</p>
          <p>– WillpowerFitness AI</p>
        `
      })
    });
  } catch (e) {
    console.warn('welcome email skipped:', e?.message || e);
  }
}

/**
 * SMS via Twilio’s HTTP API (no 'twilio' package needed). If you don’t have
 * Twilio creds set, this just no-ops.
 */
async function maybeSendWelcomeSMS(lead) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!sid || !token || !from || !lead?.phone) return; // silently skip

  try {
    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const params = new URLSearchParams({
      From: from,
      To: lead.phone,
      Body:
        'Welcome to WillpowerFitness AI. Your consult is saved — complete checkout to start your 1:1 coaching.'
    });

    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
  } catch (e) {
    console.warn('welcome SMS skipped:', e?.message || e);
  }
}
