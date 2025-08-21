// /pages/api/consult.js
export const config = { runtime: 'nodejs' };

import { getAdminClient } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const {
    name, email, phone,
    address_line1, address_line2, city, state, postal_code,
    trial // boolean or "2" if you’re passing ?trial=2
  } = req.body || {};

  // Basic validation
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

    // 2) Fire-and-forget welcome email / SMS (if keys exist)
    await Promise.allSettled([
      maybeSendWelcomeEmail(lead),
      maybeSendWelcomeSMS(lead)
    ]);

    // 3) Tell frontend where to go next (your Stripe flow)
    // If you already use /api/start-checkout, keep using it.
    // Here we return the path so the client can redirect.
    const next = trial ? '/api/start-checkout?trial=2' : '/api/start-checkout';
    return res.status(200).json({ ok: true, next });
  } catch (e) {
    console.error('consult error:', e);
    return res.status(500).json({ ok: false, error: String(e && e.message || e) });
  }
}

async function maybeSendWelcomeEmail(lead) {
  // RESEND option (no dependency unless key is present)
  if (process.env.RESEND_API_KEY && lead?.email) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM || 'WillpowerFitness AI <no-reply@yourdomain>',
        to: lead.email,
        subject: 'Welcome to WillpowerFitness AI',
        html: `
          <p>Hi ${lead.name || ''},</p>
          <p>Welcome aboard. Your consult is saved — next step is checkout to activate coaching.</p>
          <p>We’ll personalize programming, nutrition, and accountability.</p>
          <p>– WillpowerFitness AI</p>
        `
      });
    } catch (e) {
      console.warn('welcome email skipped:', e.message || e);
    }
  }
}

async function maybeSendWelcomeSMS(lead) {
  // Twilio option (no dependency unless keys are present)
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM &&
    lead?.phone
  ) {
    try {
      const twilio = (await import('twilio')).default;
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        from: process.env.TWILIO_FROM,
        to: lead.phone,
        body: `Welcome to WillpowerFitness AI. Your consult is saved — complete checkout to start your 1:1 coaching.`
      });
    } catch (e) {
      console.warn('welcome SMS skipped:', e.message || e);
    }
  }
}
