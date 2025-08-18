// pages/consultation.js
import Layout from '../components/Layout';
import { useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Consultation(){
  const [form, setForm] = useState({
    name:'', email:'', goals:'', experience:'', injuries:'', equipment:'', schedule:''
  });
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState('');   // renamed
  const [fullText, setFullText] = useState('');         // keep complete server text for PDF

  const onChange = e => setForm({...form, [e.target.name]: e.target.value});

  function summarize(text, max=750){
    if (!text) return '';
    const clean = text.trim();
    return clean.length > max ? clean.slice(0, max) + '…' : clean;
  }

  async function submit(e){
    e.preventDefault();
    setLoading(true); setSuggestions(''); setFullText('');
    try{
      const r = await fetch(`${API}/api/consult`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      });
      const j = await r.json();
      if(!r.ok) throw new Error(j?.error || `API ${r.status}`);

      // j.plan existed before — we now treat it as "fullText" and show a short suggestions preview
      const full = j.plan || 'We will tailor your starting approach around your goals and constraints.';
      setFullText(full);
      setSuggestions(summarize(full));
    }catch(err){
      console.error(err);
      alert('Could not generate suggestions. Try again.');
    }finally{ setLoading(false); }
  }

  async function downloadPdf(){
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({unit:'pt', format:'letter'});
    const margin = 48; let y = margin;

    // built-in font names are lowercase; or just omit setFont and use defaults
    doc.setFont('times','normal');
    doc.setFontSize(18);
    doc.text('WillpowerFitness AI — Consultation', margin, y); y+=24;
    doc.setFontSize(12);

    const text = fullText || 'No content.';
    const lines = doc.splitTextToSize(text, 515);
    for (const line of lines) {
      if (y > 740) { doc.addPage(); y = margin; }
      doc.text(line, margin, y); y += 16;
    }
    const filename = `WillpowerFitness_Consultation_${(form.name||'client').replace(/\s+/g,'_')}.pdf`;
    doc.save(filename);
  }

  return (
    <Layout title="Free Consultation">
      <h1>Free Consultation</h1>
      <p className="muted">Answer a few questions. We’ll suggest your best starting approach—
        then you can join as a client for full coaching.</p>

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
            {loading ? 'Working…' : 'Get my suggestions'}
          </button>
        </div>
      </form>

      {suggestions && (
        <section style={{marginTop:24}}>
          <h2>Your Suggested Starting Point</h2>
          <pre className="card" style={{whiteSpace:'pre-wrap'}}>{suggestions}</pre>

          <div style={{display:'flex',gap:12, marginTop:12, flexWrap:'wrap'}}>
            <a className="btn btn--primary" href="/subscribe">Become a client</a>
            <button className="btn btn--outline" onClick={downloadPdf}>Download full consultation</button>
          </div>

          <small className="muted" style={{display:'block', marginTop:8}}>
            Not medical advice. Consult a physician before starting any program.
          </small>
        </section>
      )}
    </Layout>
  );
}
