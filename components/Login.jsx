// components/Login.jsx
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (error) {
      setErr(error.message || "Login failed");
      return;
    }
    window.location.href = "/dashboard"; // adjust as needed
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-center text-xl font-bold">Login to WillpowerFitness AI</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full rounded border px-3 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-teal-500 px-4 py-2 font-semibold text-neutral-900 hover:bg-teal-400 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
