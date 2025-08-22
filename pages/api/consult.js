// /pages/api/consult.js
export const config = { runtime: 'nodejs' };

import { getAdminClient } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, route: '/api/consult', method: 'GET' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const {
    name, email, phone,
    address_line1, address_line2, city, state, postal_code,
    trial
  } = req.body || {};

  if (!email) return res.status(400).json({ ok: false, error: 'email required' });

  try {
    const supabase = getAdminClient();

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

    const { error } = await supabase.from('leads').upsert(lead, { onConflict: 'email' });
    if (error) throw error;

    await Promise.allSettled([maybeSendWelcomeEmail(lead)]);
    const next = trial ? '/api/start-checkout?trial=2' : '/api/start-checkout';
    return res.status(200).json({ ok: true, next });
  } catch (e) {
    console.error('consult error:', e);
    // still let the user continue to Stripe so the flow isn’t blocked
    const next = trial ? '/api/start-checkout?trial=2' : '/api/start-checkout';
    return res.status(200).json({ ok: true, next, note: 'fallback_after_error' });
  }
}

async function maybeSendWelcomeEmail(lead) {
  if (process.env.RESEND_API_KEY && lead?.email) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM || 'WillpowerFitness AI <noreply@send.willpowerfitnessai.com>',
        to: lead.email,
        subject: 'Welcome to WillpowerFitness AI',
        html: `
          <p>Hi ${lead.name || ''},</p>
          <p>Your consult is saved — next step is checkout to activate coaching.</p>
          <p>– WillpowerFitness AI</p>
        `
      });
    } catch (e) {
      console.warn('welcome email skipped:', e?.message || e);
    }
  }
}
