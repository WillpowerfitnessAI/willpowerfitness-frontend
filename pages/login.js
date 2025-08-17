// pages/login.js
import Layout from '../components/Layout';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function send(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <Layout>
      <h1>Login</h1>
      {sent ? (
        <p>Check your email for the magic link.</p>
      ) : (
        <form onSubmit={send} style={{ maxWidth: 420 }}>
          <input
            className="input"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {err && <p className="muted" style={{ color: '#c00' }}>{err}</p>}
          <button className="btn btn--primary" disabled={busy} style={{ marginTop: 12 }}>
            {busy ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      )}
    </Layout>
  );
}
