// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.trim()) ||
  (process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NEXT_PUBLIC_API_BASE_URL.trim()) ||
  'https://api.willpowerfitnessai.com';

function parseHash(hash) {
  const sp = new URLSearchParams((hash || '').replace(/^#/, ''));
  return {
    access_token: sp.get('access_token'),
    refresh_token: sp.get('refresh_token'),
    error: sp.get('error'),
    error_description: sp.get('error_description'),
  };
}

export default function AuthCallback() {
  const router = useRouter();
  const [msg, setMsg] = useState('Completing login…');

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);

        const qsErr = url.searchParams.get('error');
        const qsErrDesc = url.searchParams.get('error_description');
        const hash = parseHash(url.hash);
        if (qsErr || hash.error) {
          setMsg(`Login error: ${decodeURIComponent(qsErrDesc || hash.error_description || qsErr || hash.error)}`);
          setTimeout(() => router.replace('/login'), 1800);
          return;
        }

        const code = url.searchParams.get('code');
        if (code) {
          try {
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
            if (error) throw error;
          } catch {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;
          }
        } else if (hash.access_token && hash.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: hash.access_token,
            refresh_token: hash.refresh_token,
          });
          if (error) throw error;
        } else {
          throw new Error('No auth credentials found in callback URL');
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) throw new Error('No user after session');

        const urlMe = `${API_BASE}/api/me?email=${encodeURIComponent(user.email)}`;
        const res = await fetch(urlMe, { headers: { Accept: 'application/json' }, cache: 'no-store' });

        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const body = await res.text();
          throw new Error(`Membership API ${res.status} (non-JSON). URL: ${urlMe}. Body: ${body.slice(0, 180)}…`);
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `Membership API ${res.status}`);

        router.replace(data.is_member ? '/dashboard' : '/membership');
      } catch (e) {
        console.error(e);
        setMsg(`Login error: ${e?.message || 'Unknown error'}`);
        setTimeout(() => router.replace('/login'), 2200);
      }
    })();
  }, [router]);

  return (
    <main style={{ maxWidth: 520, margin: '80px auto', color: 'white' }}>
      <h1>{msg}</h1>
    </main>
  );
}

