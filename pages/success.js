// pages/success.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';

function formatUnixDate(unixSeconds) {
  if (!unixSeconds) return null;
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Success() {
  const [state, setState] = useState({ loading: true, error: null, info: null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('session_id');
    if (!id) {
      setState({ loading: false, error: 'Missing session_id', info: null });
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/confirm-session?session_id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to confirm session');
        setState({ loading: false, error: null, info: data });
      } catch (err) {
        setState({ loading: false, error: err.message, info: null });
      }
    })();
  }, []);

  const { loading, error, info } = state;

  return (
    <Layout title="Success">
      <main style={{ padding: 24, maxWidth: 720 }}>
        {loading && (
          <>
            <h1>Almost there</h1>
            <p>Confirming your subscription…</p>
          </>
        )}

        {error && (
          <>
            <h1>Almost there</h1>
            <p>We couldn’t confirm your checkout: <strong>{error}</strong></p>
            <a className="btn btn-primary" href="/subscribe">Retry</a>
          </>
        )}

        {info && (
          <>
            <h1>You’re in 🎉</h1>
            {info.subscription_status === 'trialing' ? (
              <p>
                Your <strong>free trial</strong> is active. It ends on{' '}
                <strong>{formatUnixDate(info.trial_end)}</strong>. We’ll start your membership after that.
              </p>
            ) : (
              <p>Your subscription status is <strong>{info.subscription_status || info.payment_status}</strong>.</p>
            )}
            <p>We’ve got you—next step is your dashboard.</p>
            <a className="btn btn-primary" href="/dashboard">Go to Dashboard</a>
          </>
        )}
      </main>
    </Layout>
  );
}
