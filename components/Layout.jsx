// components/Layout.jsx
import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../utils/supabaseClient";

export default function Layout({ title, children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get current session once
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const fullTitle = title
    ? `${title} • WillpowerFitness AI`
    : "WillpowerFitness AI — Your 24/7 no-nonsense AI Trainer";

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <header
        className="container"
        style={{ display: "flex", alignItems: "center", gap: 14 }}
      >
        {/* Logo → home */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
          aria-label="WillpowerFitness AI — home"
        >
          <img src="/logo.png" alt="WillpowerFitness AI" width="42" height="42" />
          <strong>WillpowerFitness AI</strong>
        </a>

        {/* Right side actions */}
        <nav style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          {!session ? (
            <>
              {/* Not logged in → show Login */}
              <a className="btn btn--ghost" href="/login">
                Login
              </a>
              <a className="btn btn--primary" href="/subscribe">
                Start Trial
              </a>
            </>
          ) : (
            <>
              {/* Logged in → show Dashboard + Log out (hide Login) */}
              <a className="btn btn--ghost" href="/dashboard">
                Dashboard
              </a>
              <button
                className="btn btn--outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
              >
                Log out
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="container">{children}</main>

      <footer
        className="container"
        style={{ opacity: 0.7, paddingBottom: 32, marginTop: 48 }}
      >
        <small>
          © {new Date().getFullYear()} WillpowerFitness. All rights reserved. This
          is not medical advice.
        </small>
      </footer>
    </>
  );
}
