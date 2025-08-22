// /pages/consultation.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Consultation() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address_line1, setAddress1] = useState('');
  const [address_line2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postal_code, setPostal] = useState('');

  const [trial, setTrial] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = new URLSearchParams(window.location.search).get('trial');
      setTrial(t);
    }
  }, []);

  function next() { setStep(s => Math.min(3, s + 1)); setErr(null); }
  function back() { setStep(s => Math.max(1, s - 1)); setErr(null); }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      const r = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, address_line1, address_line2, city, state, postal_code,
          trial
        })
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) throw new Error(data?.error || 'Failed to save consult');
      if (data.next) window.location.href = data.next;
    } catch (e) {
      setErr(e.message || String(e));
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head><title>Free Consultation • WillpowerFitness AI</title></Head>
      <main style={{ padding: 24, maxWidth: 840, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 24 }}>Start your {trial ? 'free trial' : 'membership'}</h1>
        <p style={{ opacity: 0.8, marginBottom: 24 }}>
          3 quick steps. We’ll personalize your coaching, then send you to checkout to confirm.
        </p>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 16, opacity: 0.7 }}>Step {step} of 3</div>

          {step === 1 && (
            <section style={{ marginBottom: 24 }}>
              <label>Name*</label>
              <input className="inp" value={name} onChange={e=>setName(e.target.value)} required />
              <label style={{ marginTop: 12 }}>Email*</label>
              <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <label style={{ marginTop: 12 }}>Phone</label>
              <input className="inp" value={phone} onChange={e=>setPhone(e.target.value)} />
            </section>
          )}

          {step === 2 && (
            <section style={{ marginBottom: 24 }}>
              <label>Address line 1*</label>
              <input className="inp" value={address_line1} onChange={e=>setAddress1(e.target.value)} required />
              <label style={{ marginTop: 12 }}>Address line 2</label>
              <input className="inp" value={address_line2} onChange={e=>setAddress2(e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginTop: 12 }}>
                <div>
                  <label>City*</label>
                  <input className="inp" value={city} onChange={e=>setCity(e.target.value)} required />
                </div>
                <div>
                  <label>State*</label>
                  <input className="inp" value={state} onChange={e=>setState(e.target.value)} required />
                </div>
                <div>
                  <label>ZIP*</label>
                  <input className="inp" value={postal_code} onChange={e=>setPostal(e.target.value)} required />
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section style={{ marginBottom: 24 }}>
              <p style={{ opacity: 0.85, marginBottom: 12 }}>
                Done. When you continue, we’ll save your consult and send you to Stripe to {trial ? 'start your free trial' : 'activate your membership'}.
              </p>
            </section>
          )}

          {err && <div style={{ color: '#f66', marginBottom: 12 }}>Error: {err}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            {step > 1 && <button type="button" className="btn" onClick={back}>Back</button>}
            {step < 3 && <button type="button" className="btn btn-primary" onClick={next}>Next</button>}
            {step === 3 && (
              <button disabled={submitting} className="btn btn-primary" type="submit">
                {submitting ? 'Saving…' : 'Continue to Stripe'}
              </button>
            )}
          </div>
        </form>

        <style jsx>{`
          .inp {
            width: 100%;
            background: #0e0e0e;
            border: 1px solid #2a2a2a;
            color: #fff;
            border-radius: 10px;
            padding: 12px 14px;
            margin-top: 6px;
          }
          .btn {
            border-radius: 999px;
            padding: 10px 16px;
            border: 1px solid #444;
            background: transparent;
            color: #fff;
          }
          .btn-primary {
            background: #fff;
            color: #000;
            border-color: #fff;
          }
          label { display:block; font-size: 14px; opacity: .9; }
        `}</style>
      </main>
    </>
  );
}

  
