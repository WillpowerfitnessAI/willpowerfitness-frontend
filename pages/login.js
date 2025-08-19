// pages/login.js
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { supabase } from "../utils/supabaseClient";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // If the user is already logged in, go to the dashboard.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) router.replace("/dashboard");
    });
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    setSent(false);

    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${SITE}/dashboard`,
        },
      });

      if (err) {
        // Friendly copy for non-members
        if (
          /user.*not.*found/i.test(err.message) ||
          /invalid.*email/i.test(err.message)
        ) {
          setError(
            "This is a members-only space. We couldn’t find an account for that email."
          );
        } else {
          setError(err.message);
        }
        return;
      }

      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <Layout title="Member Login">
      <Head>
        {/* keep the login page out of search results */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{ maxWidth: 440, margin: "40px auto" }}>
        <h1>Member login</h1>
        <p className="muted" style={{ marginTop: 4 }}>
          If you’re a paying client, enter your email and we’ll send a one-time
          login link.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <button
            className="btn btn--primary"
            type="submit"
            disabled={sending}
            style={{ marginTop: 12 }}
          >
            {sending ? "Sending…" : "Email me a login link"}
          </button>
        </form>

        {sent && (
          <p className="success" style={{ marginTop: 12 }}>
            Check your inbox for a secure login link.
          </p>
        )}
        {error && (
          <p className="error" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}

        <hr style={{ opacity: 0.2, margin: "24px 0" }} />

        <p className="muted">
          Not a member yet?{" "}
          <a className="link" href="/subscribe">
            See membership →
          </a>
        </p>
      </div>
    </Layout>
  );
}
