// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // e.g. https://api.willpowerfitnessai.com

function parseHashTokens(hash) {
  // hash looks like: #access_token=...&refresh_token=...&...
  const sp = new URLSearchParams((hash || '').replace(/^#/, ''));
  return {
    access_token: sp.get('access_token') || null,
    refresh_token: sp.get('refresh_token') || null,
    error: sp.get('error') || null,
    error_description: sp.get('error_description') || null,
  };
}

export default function AuthCallback() {
  const router = useRouter();
  const [msg, setMsg] = useState('Completing login…');

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);

        // Surface auth errors from Supabase (expired/used link, etc.)
        const qsErr = url.searchParams.get('error');
        const qsErrDesc = url.searchParams.get('error_description');
        const hashInfo = parseHashTokens(url.hash);
        if (qsErr || hashInfo.error) {
          setMsg(`Login error: ${decodeURIComponent(qsErrDesc || hashInfo.error_description || qsErr || hashInfo.error)}`);
          setTimeout(() => router.replace('/login'), 2000);
          return;
        }

        // --- Handle both redirect modes ---

        // 1) PKCE code flow: ?code=... (newer Supabase / OTP links sometimes use this)
        const code = url.searchParams.get('code');
        if (code) {
          // Try the modern signature first (full URL); fall back to passing code only.
          let exchanged = false;
          try {
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
            if (error) throw error;
            exchanged = true;
          } catch {
            const { error: e2 } = await supabase.auth.exchangeCodeForSession(code);
            if (e2) throw e2;
            exchanged = true;
          }
          if (!exchanged) throw new Error('Unable to exchange auth code for session');
        }

        // 2) Hash-token flow: #access_token=...&refresh_token=... (classic magic link)
        if (!code && hashInfo.access_token && hashInfo.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: hashInfo.access_token,
            refresh_token: hashInfo.refresh_token,
          });
          if (error) throw error;
        }

        // If neither path hit, we have no credentials
        if (!code && !(hashInfo.access_token && hashInfo.refresh_token)) {
          throw new Error('No auth credentials found in callback URL');
        }

        // Fetch the user & membership
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) throw new Error('No user after session');
        const r = await fetch(`${API_BASE}/api/me?email=${encodeURIComponent(user.email)}`, { cache: 'no-store' });
        const payload = await r.json();
        if (!r.ok) throw new Error(payload?.error || 'Membership lookup failed');

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
