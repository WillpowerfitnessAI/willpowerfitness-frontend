// pages/success.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Success() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data?.user);
    });
  }, []);

  const goLogin = () => router.replace('/login?next=/dashboard');

  return (
    <main style={{minHeight:'70vh',display:'grid',placeItems:'center',background:'#0a0a0a',color:'#fff'}}>
      <div style={{textAlign:'center',maxWidth:640}}>
        <h1>You're in! 🎉</h1>
        <p style={{opacity:.85,marginTop:8}}>
          Checkout completed and your membership is active.
        </p>

        {loggedIn ? (
          <a href="/dashboard">
            <button
              style={{marginTop:16,padding:'0.9rem 1.1rem',borderRadius:12,border:'1px solid #fff',
                      background:'#fff',color:'#000',cursor:'pointer'}}>
              Go to dashboard
            </button>
          </a>
        ) : (
          <>
            <p style={{opacity:.85,marginTop:16}}>
              Next step: create your login to start training.
            </p>
            <button onClick={goLogin}
              style={{marginTop:12,padding:'0.9rem 1.1rem',borderRadius:12,border:'1px solid #fff',
                      background:'#fff',color:'#000',cursor:'pointer'}}>
              Log in / Create account
            </button>
          </>
        )}
      </div>
    </main>
  );
}
