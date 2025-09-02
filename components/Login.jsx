// components/Login.jsx
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErr("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return setErr(error.message);
    onLogin?.(email);
    window.location.href = "/chat"; // or wherever you want after login
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold mb-4">Log in to WillpowerFitness AI</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {err && <p className="text-sm text-red-400 mb-3">{err}</p>}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full rounded-xl bg-teal-500 px-4 py-2 font-semibold text-neutral-900 hover:bg-teal-400 disabled:opacity-50"
      >
        {loading ? "Logging in…" : "Continue"}
      </button>
    </div>
  );
}

