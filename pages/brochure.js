// pages/brochure.js
import Footer from '../components/Footer';

export default function Brochure() {
  const buyUrl   = process.env.NEXT_PUBLIC_STRIPE_BUY_URL;
  const trialUrl = process.env.NEXT_PUBLIC_STRIPE_TRIAL_URL;

  return (
    <main className="page">
      <section className="hero">
        <h1>What you get</h1>
        <p className="sub">
          High-performance coaching that adapts to your goals, schedule, and constraints.
          Firm, pragmatic, no fluff.
        </p>

        <div className="grid">
          <div className="card">
            <h3>Elite AI Coaching</h3>
            <p>Dynamic adjustments, biomechanics focus, RPE-aware progressions.</p>
          </div>
          <div className="card">
            <h3>Lifestyle Integration</h3>
            <p>Nutrition, sleep, stress, and recovery—tight feedback loop with training.</p>
          </div>
          <div className="card">
            <h3>Relationship Builder</h3>
            <p>Learns your preferences & motivation style over time to keep you consistent.</p>
          </div>
          <div className="card">
            <h3>White-glove UX</h3>
            <p>Clear programming, fast check-ins, and accountable coaching—any device.</p>
          </div>
        </div>

        <div className="bullets">
          <ul>
            <li>Personalized training split that fits your week (2–6 days)</li>
            <li>Injury-aware tweaks (knee/shoulder/back friendly options)</li>
            <li>Simple nutrition guardrails (protein, hydration, steps)</li>
            <li>Weekly adjustments from real-world compliance</li>
          </ul>
        </div>

        <div className="btnRow">
          <a href="/consult">
            <button className="btn btn--ghost">Start Free Consultation</button>
          </a>

          <a href={trialUrl || '#'} onClick={(e)=>{ if(!trialUrl){ e.preventDefault(); alert('Trial link not configured.'); }}}>
            <button className="btn btn--dark" disabled={!trialUrl}>Start Trial</button>
          </a>

          <a href={buyUrl || '#'} onClick={(e)=>{ if(!buyUrl){ e.preventDefault(); alert('Join link not configured.'); }}}>
            <button className="btn btn--light" disabled={!buyUrl}>Join Now — $225/mo</button>
          </a>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
          display: grid;
          grid-template-rows: 1fr auto;
        }
        .hero {
          max-width: 980px;
          margin: 0 auto;
          text-align: center;
          padding: 2.25rem 1rem 3rem;
        }
        h1 { font-size: clamp(2rem, 6vw, 3rem); margin: 0 0 .5rem; }
        .sub { opacity: .82; margin: 0 0 1.25rem; }
        .grid {
          display: grid;
          gap: 12px;
          margin: 18px 0;
          grid-template-columns: 1fr;
        }
        .card {
          border: 1px solid #222;
          background: #101010;
          border-radius: 14px;
          padding: 14px 16px;
          text-align: left;
        }
        .card h3 { margin: 0 0 .25rem; font-size: 1.05rem; }
        .card p { margin: 0; opacity: .85; }

        .bullets { text-align: left; margin: 14px auto 4px; max-width: 820px; }
        .bullets ul { margin: 0; padding-left: 1.1rem; opacity: .9; }

        .btnRow {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          justify-content: center;
          align-items: center;
          margin-top: 16px;
        }
        .btn {
          width: 100%;
          padding: .9rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          border: 1px solid #444;
        }
        .btn[disabled]{ opacity:.5; cursor:not-allowed; }
        .btn--ghost { background:#111; color:#fff; }
        .btn--dark  { background:#1a1a1a; color:#fff; border-color:#1f1f1f; }
        .btn--light { background:#fff; color:#000; border-color:#fff; }

        @media (min-width: 640px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
          .btnRow { grid-template-columns: repeat(3, max-content); }
          .btn { width: auto; }
        }
      `}</style>
    </main>
  );
}
