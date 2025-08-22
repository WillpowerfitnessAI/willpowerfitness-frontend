// add near top of file (server-only)
function optRequire(name) {
  try { return eval('require')(name); } catch { return null; }
}

async function maybeSendWelcomeEmail(lead) {
  if (!process.env.RESEND_API_KEY || !lead?.email) return;
  const Resend = optRequire('resend')?.Resend;   // optional
  if (!Resend) return; // package not installed -> silently skip
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM || 'WillpowerFitness AI <noreply@send.willpowerfitnessai.com>',
    to: lead.email,
    subject: 'Welcome to WillpowerFitness AI',
    html: `
      <p>Hi ${lead.name || ''},</p>
      <p>Welcome aboard. Your consult is saved — next step is checkout to activate coaching.</p>
      <p>– WillpowerFitness AI</p>
    `
  });
}

async function maybeSendWelcomeSMS(lead) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM || !lead?.phone) return;
  const twilio = optRequire('twilio');  // optional
  if (!twilio) return; // package not installed -> skip
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  await client.messages.create({
    from: TWILIO_FROM,
    to: lead.phone,
    body: 'Welcome to WillpowerFitness AI. Your consult is saved — complete checkout to start coaching.'
  });
}

