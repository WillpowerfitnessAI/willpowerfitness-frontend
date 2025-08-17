// pages/consultation.js
import Layout from '../components/Layout';
import { useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Consultation(){
  const [form, setForm] = useState({
    name:'', email:'', goals:'', experience:'', injuries:'', equipment:'', schedule:''
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');

  const onChange = e => setForm({...form, [e.target.name]: e.target.value});

  async function submit(e){
    e.preventDefault();
    setLoading(true); setPlan('');
    try{
      const r = await fetch(`${API}/api/consult`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      });
      const j = await r.json();
      if(!r.ok) throw new Error(j?.error || `API ${r.status}`);
      setPlan(j.plan || '');
    }catch(err){
      console.error(err);
      alert('Could not generate plan. Try again.');
    }finally{ setLoading(false); }
  }

  async function downloadPdf(){
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({unit:'pt', format:'letter'});
    const margin = 48; let y = margin;
    doc.setFont('Times','Normal'); doc.setFontSize(18);
    doc.text('WillpowerFitness AI — Consultation Plan', margin, y); y+=24;
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(plan || 'No plan.', 515);
    lines.forEach(line => { if(y>740){ doc.addPage(); y=margin; } doc.text(line, margin, y); y+=16; });
    doc.save(`WillpowerFitness_Plan_${(form.name||'client').replace(/\s+/g,'_')}.pdf`);
  }

  return (
    <Layout>
      <h1>Free Consultation</h1>
      <p className="muted">Answer honestly; I’ll tailor your starter plan. No fluff.</p>

      <form onSubmit={submit} className="grid grid-2" style={{marginTop:16}}>
        <div>
          <label className="label">Name</label>
          <input className="input" name="name" value={form.name} onChange={onChange} required/>
          <label className="label">Email</label>
          <input className="input" type="email" name="email" value={form.email} onChange={onChange}/>
          <label className="label">Goals</label>
          <textarea className="input" rows={4} name="goals" value={form.goals} onChange={onChange} required/>
          <label className="label">Experience</label>
          <select className="input" name="experience" value={form.experience} onChange={onChange}>
            <option value="">Select</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>
        <div>
          <label className="label">Injuries / Limitations</label>
          <textarea className="input" rows={3} name="injuries" value={form.injuries} onChange={onChange}/>
          <label className="label">Equipment available</label>
          <textarea className="input" rows={3} name="equipment" value={form.equipment} onChange={onChange}/>
          <label className="label">Schedule (preferred days/times)</label>
          <textarea className="input" rows={3} name="schedule" value={form.schedule} onChange={onChange}/>
          <button className="btn btn--primary" type="submit" disabled={loading} style={{marginTop:12}}>
            {loading ? 'Working…' : 'Generate my plan'}
          </button>
        </div>
      </form>

      {plan && (
        <section style={{marginTop:24}}>
          <h2>Your Personalized Plan</h2>
          <pre className="card" style={{whiteSpace:'pre-wrap'}}>{plan}</pre>
          <div style={{display:'flex',gap:12, marginTop:12}}>
            <button className="btn btn--outline" onClick={downloadPdf}>Download PDF</button>
            <a className="btn btn--primary" href="/subscribe">Start free trial →</a>
          </div>
          <small className="muted">Not medical advice. Consult a physician before starting any program.</small>
        </section>
      )}
    </Layout>
  );
}
