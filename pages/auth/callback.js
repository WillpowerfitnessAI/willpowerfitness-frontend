// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // e.g. https://api.willpowerfitnessai.com

export default function AuthCallback() {
  const router = useRouter();
  const [msg, setMsg] = useState('Completing login…');

  useEffect(() => {
    (async () => {
      try {
        // Handle errors Supabase appends to the URL (expired/used link, etc.)
        const url = new URL(window.location.href);
        const qsErr = url.searchParams.get('error') || url.hash.match(/error=([^&]+)/)?.[1];
        const qsDesc = url.searchParams.get('error_description') || url.hash.match(/error_description=([^&]+)/)?.[1];
        if (qsErr) {
          const reason = decodeURIComponent(qsDesc || qsErr);
          setMsg(`Login error: ${reason}`);
          setTimeout(() => router.replace('/login'), 2000);
          return;
        }

        // Turn the URL hash into a Supabase session
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) throw error;

        // Get the user email
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) throw new Error('No user email after login');

        // Ask backend if this email is a member (set by the Stripe webhook)
        const res = await fetch(`${API_BASE}/api/me?email=${encodeURIComponent(user.email)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error || 'Membership lookup failed');

        // Route based on membership
        if (payload.is_member) {
          setMsg('Welcome back — redirecting to your dashboard…');
          router.replace('/dashboard');
        } else {
          setMsg('Membership required — redirecting…');
          router.replace('/membership');
        }
      } catch (err) {
        console.error(err);
        setMsg(`Login error: ${err?.message || 'Unknown error'}`);
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
