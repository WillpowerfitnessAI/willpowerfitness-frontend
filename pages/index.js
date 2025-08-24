// pages/index.js
import Footer from '../Footer'; // <-- if you moved Footer to /components/Footer.js, change to '../components/Footer'

export default function Home() {
  const buyUrl   = process.env.NEXT_PUBLIC_STRIPE_BUY_URL;
  const trialUrl = process.env.NEXT_PUBLIC_STRIPE_TRIAL_URL;

  return (
    <main style={{
      minHeight:'100vh', background:'#0a0a0a', color:'#fff',
      display:'grid', placeItems:'center', padding:'2rem'
    }}>
      <section style={{ maxWidth:720, textAlign:'center' }}>
        <img src="/logo.png" alt="WillpowerFitnessAI" style={{ height:56, opacity:.9 }} />
        <h1 style={{ fontSize:'2.2rem', margin:'1rem 0 0.5rem' }}>
          High-performance coaching, white-glove.
        </h1>
        <p style={{ opacity:.8, margin:'0 0 1.5rem' }}>Elite results. $225/month. Cancel anytime.</p>

        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <a href="/consult">
            <button style={{ padding:'0.9rem 1.1rem', borderRadius:12, border:'1px solid #444',
                             background:'#111', color:'#fff', cursor:'pointer' }}>
              Start Free Consultation
            </button>
          </a>

          <a href={trialUrl}>
            <button style={{ padding:'0.9rem 1.1rem', borderRadius:12, border:'1px solid #1f1f1f',
                             background:'#1a1a1a', color:'#fff', cursor:'pointer' }}>
              Start Trial
            </button>
          </a>

          <a href={buyUrl}>
            <button style={{ padding:'0.9rem 1.1rem', borderRadius:12, border:'1px solid #fff',
                             background:'#fff', color:'#000', cursor:'pointer' }}>
              Join Now — $225/mo
            </button>
          </a>
        </div>

        <p style={{ fontSize:12, opacity:.6, marginTop:'1rem' }}>Secure checkout via Stripe.</p>
      </section>

      <Footer /> {/* footer links: Terms / Privacy / Disclaimer */}
    </main>
  );
}

