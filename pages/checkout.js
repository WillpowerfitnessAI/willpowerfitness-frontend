// pages/checkout.js
import { useEffect, useState } from 'react';

export default function Checkout() {
  const [msg, setMsg] = useState('Redirecting to secure checkout…');

  useEffect(() => {
    const intent = new URL(window.location.href).searchParams.get('intent') || 'join';
    const API = process.env.NEXT_PUBLIC_API_BASE_URL || ''; // e.g. https://api.willpowerfitnessai.com

    async function go() {
      try {
        // 1) Try backend session creation
        const res = await fetch(`${API}/api/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ intent }),
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (!data?.url) throw new Error('No checkout URL in response.');
        window.location.replace(data.url);
      } catch (err) {
        // 2) Fallback to payment links so users aren’t stuck
        const trialLink = process.env.NEXT_PUBLIC_STRIPE_TRIAL_URL;
        const buyLink   = process.env.NEXT_PUBLIC_STRIPE_BUY_URL;

        if (intent === 'trial' && trialLink) return window.location.replace(trialLink);
        if (intent === 'join'  && buyLink)   return window.location.replace(buyLink);

        setMsg('Could not start checkout.');
        console.error('Checkout error:', err);
      }
    }

    go();
  }, []);

  return (
    <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#0a0a0a',color:'#fff'}}>
      <div style={{textAlign:'center'}}>
        <h1>Redirecting to secure checkout…</h1>
        <p style={{opacity:.8,marginTop:12}}>{msg}</p>
      </div>
    </main>
  );
}
