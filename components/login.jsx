// components/Login.jsx
import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const isValidEmail = (v) => /\S+@\S+\.\S+/.test(v);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const value = email.trim();
    if (!isValidEmail(value)) {
      setErr("Please enter a valid email.");
      return;
    }
    try {
      setBusy(true);
      // For now we just hand the email to the parent.
      // Later we'll swap this for Supabase magic-link auth.
      if (typeof onLogin === "function") onLogin(value);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Login to WillpowerFitness AI</h2>
        <p className="muted" style={{ marginTop: 4 }}>
          We’ll add magic-link auth in the next pass; for now this just passes
          your email to the app.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {err && (
            <div style={{ color: "#ff6b6b", marginTop: 8 }}>{err}</div>
          )}
          <button
            className="btn btn--primary"
            type="submit"
            disabled={busy}
            style={{ marginTop: 12 }}
          >
            {busy ? "Working…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
