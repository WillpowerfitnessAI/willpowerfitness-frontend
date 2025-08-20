// pages/login.js
import { useState } from 'react';
import Layout from '../components/Layout.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function requestLoginLink(e) {
    e.preventDefault();
    setMsg('');
    if (!email) return setMsg('Enter your email.');

    try {
      setBusy(true);
      const res = await fetch('/api/login-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data?.error === 'not_subscribed') {
          setMsg('No active membership found for this email. Start a trial or subscribe.');
        } else if (data?.error === 'invalid_email') {
          setMsg('That email looks invalid.');
        } else {
          setMsg('Could not send login link. Try again.');
        }
        return;
      }

      // Direct login: jump to the Supabase magic link (no email click needed)
      if (data?.login_url) {
        window.location.assign(data.login_url);
      } else {
        setMsg('Login link not available. Try again.');
      }
    } catch {
      setMsg('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout title="Member login">
      <main style={{ padding: 24, maxWidth: 720 }}>
        <h1>Member login</h1>
        <p>If you’re a paying client, enter your email and we’ll sign you in.</p>

        <form onSubmit={requestLoginLink} style={{ marginTop: 16 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="input"
            style={{ width: 360, marginRight: 8 }}
          />
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Working…' : 'Email me a login link'}
          </button>
        </form>

        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

        <hr style={{ margin: '24px 0', opacity: 0.2 }} />

        <p>
          Not a member yet? <a href="/subscribe">See membership</a>
        </p>
      </main>
    </Layout>
  );
}

