// pages/checkout.js
import { useEffect } from 'react';

export default function Checkout() {
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { Accept: 'application/json' },
        });
        const data = await res.json();
        if (data?.url) {
          window.location.assign(data.url);
        } else {
          alert('Could not start checkout.');
        }
      } catch {
        alert('Could not start checkout.');
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Sending you to Stripe…</h1>
    </main>
  );
}

