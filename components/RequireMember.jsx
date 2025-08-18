// components/RequireMember.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase =
  typeof window !== "undefined"
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    : null;

export default function RequireMember({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      if (!supabase) return; // SSR safeguard
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (!mounted) return;
      if (!session) {
        router.replace("/login");
      } else {
        setChecking(false);
      }
    }

    check();
    // also listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
      else setChecking(false);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [router]);

  if (checking) {
    return (
      <div style={{ padding: 24 }}>
        <p className="muted">Checking membership…</p>
      </div>
    );
  }

  return <>{children}</>;
}
