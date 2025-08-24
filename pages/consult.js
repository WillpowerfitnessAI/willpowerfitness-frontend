export default function Consult() {
  const buyUrl   = process.env.NEXT_PUBLIC_STRIPE_BUY_URL;
  const trialUrl = process.env.NEXT_PUBLIC_STRIPE_TRIAL_URL;

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',color:'#fff',
                  display:'grid',placeItems:'center',padding:'2rem'}}>
      <section style={{maxWidth:800}}>
        <h1 style={{fontSize:'2rem',marginBottom:'0.5rem'}}>Free Consultation</h1>
        <p style={{opacity:.8,marginBottom:'1rem'}}>
          15–20 minutes to align goals, schedule, and constraints. No pressure. If you’re not ready to join,
          download the overview and start when you’re ready.
        </p>

        <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'1rem'}}>
          <a href="mailto:info@wheresyourwill.com?subject=Consultation%20Request">
            <button style={{padding:'0.8rem 1rem',borderRadius:12,border:'1px solid #444',background:'#111',color:'#fff',cursor:'pointer'}}>
              Email to Schedule
            </button>
          </a>
          <a href="/brochure.pdf" download>
            <button style={{padding:'0.8rem 1rem',borderRadius:12,border:'1px solid #444',background:'#111',color:'#fff',cursor:'pointer'}}>
              Download Overview (PDF)
            </button>
          </a>
          <a href={trialUrl}>
            <button style={{padding:'0.8rem 1rem',borderRadius:12,border:'1px solid #1f1f1f',background:'#1a1a1a',color:'#fff',cursor:'pointer'}}>
              Start Trial
            </button>
          </a>
          <a href={buyUrl}>
            <button style={{padding:'0.8rem 1rem',borderRadius:12,border:'1px solid #fff',background:'#fff',color:'#000',cursor:'pointer'}}>
              Join Now
            </button>
          </a>
        </div>

        <p style={{fontSize:12,opacity:.65}}>Prefer a call? Reply to the email with your availability.</p>
      </section>
    </main>
  );
}
