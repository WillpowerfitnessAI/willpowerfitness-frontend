// pages/success.js
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function Success(){
  const [state, setState] = useState({loading:true, email:'', member:false, err:''});

  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get('session_id');
    if(!sid){ setState({loading:false, email:'', member:false, err:'Missing session_id'}); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/success?session_id=${encodeURIComponent(sid)}`)
      .then(r => r.json().then(j => ({ok:r.ok, j})))
      .then(({ok, j}) => setState({loading:false, email:j.email, member:j.member, err: ok?'':'Verify failed'}))
      .catch(e => setState({loading:false, email:'', member:false, err:String(e)}));
  }, []);

  return (
    <Layout>
      <h1>{state.loading ? 'Verifying…' : (state.member ? 'You’re in.' : 'Almost there')}</h1>
      {state.email && <p>Welcome, {state.email}.</p>}
      {state.member
        ? <a className="btn btn--primary" href="/dashboard">Go to Dashboard</a>
        : <a className="btn btn--outline" href="/subscribe">Retry</a>}
    </Layout>
  );
}
