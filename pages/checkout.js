// pages/checkout.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Checkout() {
  const router = useRouter();
  const { intent = 'join' } = router.query;
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ intent })
        });
        const data = await res.json();
        if (data?.url) window.location.href = data.url;
        else setError('Could not start checkout.');
      } catch {
        setError('Could not start checkout.');
      }
    })();
  }, [router.isReady, intent]);

  return (
    <main style={{minHeight:'70vh',display:'grid',placeItems:'center',color:'#fff',background:'#0a0a0a'}}>
      <div style={{textAlign:'center'}}>
        <h1>Redirecting to secure checkout…</h1>
        {error && <p style={{marginTop:12,opacity:.8}}>{error}</p>}
      </div>
    </main>
  );
}
