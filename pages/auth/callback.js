// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // e.g. https://api.willpowerfitnessai.com

export default function AuthCallback() {
  const router = useRouter();
  const [msg, setMsg] = useState('Completing login…');

  useEffect(() => {
    (async () => {
      try {
        // If Supabase appended an error (expired/used link), bail fast
        const url = new URL(window.location.href);
        const err = url.searchParams.get('error') || url.hash.match(/error=([^&]+)/)?.[1];
        const desc = url.searchParams.get('error_description') || url.hash.match(/error_description=([^&]+)/)?.[1];
        if (err) {
          setMsg(`Login error: ${decodeURIComponent(desc || err)}`);
          setTimeout(() => router.replace('/login'), 2000);
          return;
        }

        // 1) Turn URL hash into a Supabase session
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) throw error;

        // 2) Get the email
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) throw new Error('No user email after login');

        // 3) Ask the backend if they’re a member (Stripe webhook populates this)
        const res = await fetch(`${API_BASE}/api/me?email=${encodeURIComponent(user.email)}`, { cache: 'no-store' });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error || 'Membership lookup failed');

        if (payload.is_member) {
          setMsg('Welcome back — redirecting…');
          router.replace('/dashboard');
        } else {
          setMsg('Membership required — redirecting…');
          router.replace('/membership');
        }
      } catch (e) {
        console.error(e);
        setMsg(`Login error: ${e?.message || 'Unknown error'}`);
        setTimeout(() => router.replace('/login'), 2500);
      }
    })();
  }, [router]);

  return (
    <main style={{ maxWidth: 520, margin: '80px auto', color: 'white' }}>
      <h1>{msg}</h1>
    </main>
  );
}
