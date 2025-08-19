// pages/login.js
import { useState } from "react";
import Layout from "../components/Layout";
import { supabase } from "../utils/supabaseClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://app.willpowerfitnessai.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${SITE_URL}/dashboard` },
    });

    if (error) {
      // When sign-ups are disabled and the email isn't a member, Supabase returns an error.
      const membersOnly =
        /signup/i.test(error.message) || error.status === 403 || error.status === 422;

      setStatus({
        state: "error",
        message: membersOnly
          ? "This is a members-only space. If you’re not a client yet, please start a free consultation or join the program."
          : error.message,
      });
      return;
    }

    setStatus({
      state: "ok",
      message: "Check your email for a magic login link.",
    });
  }

  return (
    <Layout title="Member login">
      <h1>Member login</h1>
      <p className="muted">We use passwordless magic links.</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 420, marginTop: 16 }}>
        <input
          className="input"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="btn btn--primary"
          disabled={status.state === "loading"}
          style={{ marginTop: 12 }}
        >
          {status.state === "loading" ? "Sending…" : "Send me a login link"}
        </button>
      </form>

      {status.message && (
        <div style={{ marginTop: 12 }}>
          <p className={status.state === "error" ? "muted" : ""}>{status.message}</p>

          {status.state === "error" && (
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <a className="btn btn--outline" href="/consultation">
                Start free consultation
              </a>
              <a className="btn btn--primary" href="/subscribe">
                Join now
              </a>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
