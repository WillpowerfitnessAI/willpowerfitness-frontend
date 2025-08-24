export default function Privacy() {
  return (
    <main style={{maxWidth:820,margin:"4rem auto",padding:"0 1rem",lineHeight:1.6}}>
      <h1>Privacy Policy</h1>
      <p>We respect your privacy. This policy explains what we collect and why.</p>

      <h2>Data We Collect</h2>
      <ul>
        <li><b>Account & Contact:</b> name, email.</li>
        <li><b>Consult Intake:</b> goals, schedule, experience, constraints, preferences (members only).</li>
        <li><b>Usage:</b> device/analytics to improve the product.</li>
        <li><b>Billing:</b> handled by Stripe; we do not store full card details.</li>
      </ul>

      <h2>How We Use Data</h2>
      <ul>
        <li>Provide and personalize coaching</li>
        <li>Send service messages and receipts</li>
        <li>Improve the Service and detect abuse</li>
      </ul>

      <h2>Retention</h2>
      <p><b>Members:</b> we retain your coaching history while your account is active.<br/>
         <b>Non-members:</b> after the consult session we retain only your name and email for follow-up; other intake is discarded.</p>

      <h2>Sharing</h2>
      <p>We share with processors (e.g., Stripe, Supabase, Printful) strictly to operate the Service. No sale of personal data.</p>

      <h2>Security</h2>
      <p>Encryption in transit (TLS), least-privilege access, signed webhooks, rate-limits, and regular key rotation.</p>

      <h2>Your Rights</h2>
      <p>Request access, correction, deletion, or export of your data by emailing info@wheresyourwill.com.</p>

      <h2>Contact</h2>
      <p>info@wheresyourwill.com</p>
    </main>
  );
}
