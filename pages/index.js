// pages/index.js
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <h1 style={{fontSize:44, marginBottom:8}}>
          Your 24/7 no-nonsense AI Trainer.
        </h1>
        <p style={{maxWidth:680, opacity:.85}}>
          WillpowerFitness AI is your always-on coach—firm, pragmatic, with a hint of jocularity.
          Training, nutrition, recovery, and accountability—integrated and adaptive.
        </p>
        <div style={{marginTop:24, display:'flex', gap:12}}>
          <a className="btn btn--primary" href="/consultation">Start free consultation</a>
          <a className="btn btn--outline" href="/subscribe">See membership</a>
        </div>

        <div style={{marginTop:28}} className="grid grid-2">
          <div className="card"><strong>Elite AI Coaching</strong><br/><small className="muted">Dynamic adjustments, biomechanics, RPE-aware.</small></div>
          <div className="card"><strong>Relationship Builder</strong><br/><small className="muted">Learns preferences & motivation style over time.</small></div>
          <div className="card"><strong>Lifestyle Integration</strong><br/><small className="muted">Nutrition, sleep, stress, recovery—end-to-end.</small></div>
          <div className="card"><strong>White-label Pro</strong><br/><small className="muted">Your brand, your domain, premium UX.</small></div>
        </div>
      </section>
    </Layout>
  );
}
