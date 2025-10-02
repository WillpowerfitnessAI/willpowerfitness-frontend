// /pages/login.js
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const cleanEmail = (email || "").trim().toLowerCase();

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) throw error;

      // success — send them to the app home (or /dashboard if you have one)
      window.location.href = "/";
    } catch (e) {
      setErr(e.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-md px-4 py-12">
        <header className="flex items-center justify-between mb-8">
          <span className="text-sm font-semibold text-neutral-300">
            WillpowerFitness AI
          </span>
          <Link href="/subscribe" className="text-sm text-neutral-300 hover:text-white">
            Start Elite Access
          </Link>
        </header>

        <h1 className="text-2xl font-bold mb-6">Log in to WillpowerFitness AI</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md px-3 py-2 bg-black/40 border border-white/10 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md px-3 py-2 bg-black/40 border border-white/10 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {err ? <p className="text-red-400 text-sm">{err}</p> : null}

          <button
            type="submit"
            className="rounded-md bg-teal-500 hover:bg-teal-400 px-5 py-2 font-semibold text-neutral-900 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="mt-3 text-xs text-neutral-500">
          We’ll use your email to get you set up.
        </p>
      </div>
    </main>
  );
}
