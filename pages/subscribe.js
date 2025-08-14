// pages/subscribe.js
export default function Subscribe() {
  const link = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK; // set this in Vercel

  return (
    <main style={{ padding: '3rem', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
      <h1>Join WillpowerFitness AI</h1>
      <p>Train smarter. Think stronger. Move better.</p>

      {link ? (
        <a href={link}>
          <button style={{ padding: '0.75rem 1.25rem', fontSize: 16, cursor: 'pointer' }}>
            Subscribe Now
          </button>
        </a>
      ) : (
        <p style={{ color: '#a00' }}>
          Missing <code>NEXT_PUBLIC_STRIPE_PAYMENT_LINK</code> environment variable.
        </p>
      )}
    </main>
  );
}

