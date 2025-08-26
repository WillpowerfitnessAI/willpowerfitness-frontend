// pages/login.js
import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const requestLoginLink = async (e) => {
    e.preventDefault();
    setMsg('');

    const value = email.trim();
    if (!value) {
      setMsg('Enter your email.');
      return;
    }

    try {
      setBusy(true);

      // Send a Supabase magic link that redirects to /auth/callback
      const { error } = await supabase.auth.signInWithOtp({
        email: value,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // Common errors: rate limit, invalid redirect, provider not configured
        setMsg(error.message || 'Could not send login link. Try again.');
        return;
        }

      setMsg('Check your email for the login link.');
    } catch {
      setMsg('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout title="Member login">
      <main style={{ padding: 24, maxWidth: 720 }}>
        <h1>Member login</h1>
        <p>If you’re a paying client, enter your email and we’ll sign you in.</p>

        <form onSubmit={requestLoginLink} style={{ marginTop: 16 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="input"
            style={{ width: 360, marginRight: 8 }}
            required
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


