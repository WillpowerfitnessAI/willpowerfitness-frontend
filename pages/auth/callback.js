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
        const url = new URL(window.location.href);

        // If Supabase appended an auth error (expired/used link), bounce early
        const err = url.searchParams.get('error') || url.hash.match(/error=([^&]+)/)?.[1];
        const desc = url.searchParams.get('error_description') || url.hash.match(/error_description=([^&]+)/)?.[1];
        if (err) {
          setMsg(`Login error: ${decodeURIComponent(desc || err)}`);
          setTimeout(() => router.replace('/login'), 2000);
          return;
        }

        // --- Handle both Supabase redirect modes ---
        // 1) PKCE code flow: ?code=...&state=...
        const code = url.searchParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        // 2) Hash-token flow: #access_token=...&refresh_token=...
        else if (url.hash.includes('access_token')) {
          // Parses the hash and stores the session for you
          const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
          if (error) throw error;
        } else {
          throw new Error('No auth credentials found in callback URL');
        }

        // Get the logged-in user’s email
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) throw new Error('No user after session exchange');

        // Ask backend if this email is a member (Stripe webhook sets this)
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
