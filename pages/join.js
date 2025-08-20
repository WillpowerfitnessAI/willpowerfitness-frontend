// pages/join.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';

export default function Join() {
  const [trialDays, setTrialDays] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = Number(q.get('trial'));
    if (!Number.isNaN(t) && t > 0) setTrialDays(t);
  }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name')?.trim(),
      email: fd.get('email')?.trim(),
      phone: fd.get('phone')?.trim(),
      address: {
        line1: fd.get('line1')?.trim(),
        line2: fd.get('line2')?.trim() || undefined,
        city: fd.get('city')?.trim(),
        state: fd.get('state')?.trim(),
        postal_code: fd.get('postal_code')?.trim(),
        country: 'US',
      },
    };

    if (!payload.email || !payload.name || !payload.address.line1 || !payload.address.city || !payload.address.state || !payload.address.postal_code) {
      setMsg('Please complete all required fields.');
      return;
    }

    try {
      setBusy(true);
      const res = await fetch(`/api/start-checkout?trial=${trialDays || 0}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data?.url) {
        window.location.assign(data.url);
      } else {
        setMsg(data?.error || 'Could not start checkout. Try again.');
      }
    } catch {
      setMsg('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout title={trialDays > 0 ? 'Start Free Trial' : 'Become a Member'}>
      <main style={{ padding: 24, maxWidth: 720 }}>
        <h1>{trialDays > 0 ? 'Start your free trial' : 'Become a member'}</h1>
        <p style={{ opacity: 0.8 }}>
          Tell us a bit about you. Next step will take you to Stripe to confirm.
        </p>

        <form onSubmit={submit} style={{ marginTop: 16 }}>
          <div className="grid" style={{ display: 'grid', gap: 12 }}>
            <label>
              Name*
              <input name="name" placeholder="Full name" className="input" required />
            </label>
            <label>
              Email*
              <input name="email" type="email" placeholder="you@domain.com" className="input" required />
            </label>
            <label>
              Phone
              <input name="phone" placeholder="(###) ###-####" className="input" />
            </label>

            <label>
              Address line 1*
              <input name="line1" placeholder="Street address" className="input" required />
            </label>
            <label>
              Address line 2
              <input name="line2" placeholder="Apt, suite, etc." className="input" />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px', gap: 12 }}>
              <label>
                City*
                <input name="city" className="input" required />
              </label>
              <label>
                State*
                <input name="state" className="input" required />
              </label>
              <label>
                ZIP*
                <input name="postal_code" className="input" required />
              </label>
            </div>
          </div>

          {msg && <p style={{ color: 'salmon', marginTop: 10 }}>{msg}</p>}

          <button className="btn btn-primary" disabled={busy} style={{ marginTop: 16 }}>
            {busy ? 'Processing…' : 'Continue to Stripe'}
          </button>
        </form>
      </main>
    </Layout>
  );
}
