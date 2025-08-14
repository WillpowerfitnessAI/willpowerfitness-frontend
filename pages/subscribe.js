// pages/subscribe.js
const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Subscribe() {
  async function goCheckout() {
    try {
      const r = await fetch(`${API}/api/checkout`, { method: 'POST' });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || `API ${r.status}`);
      window.location.href = data.url; // Stripe Checkout
    } catch (e) {
      console.error(e);
      alert('Checkout failed. Please try again.');
    }
  }

  return (
    <main style={{ padding: '3rem', textAlign: 'center' }}>
      <h1>Join WillpowerFitness AI</h1>
      <p>Train smarter. Think stronger. Move better.</p>
      <button onClick={goCheckout} style={{ padding: '0.75rem 1.25rem', fontSize: 16 }}>
        Subscribe Now – $225/month
      </button>
    </main>
  );
}

