// pages/subscribe.js
import { useState } from "react";
// NOTE: supabase import not needed for this step; we'll add it back after Stripe gating
// import { supabase } from "../utils/supabaseClient";

export default function Subscribe() {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 For now we only send the email to Stripe Checkout.
  // The other fields (name, goal, password) stay in the form and will be used
  // when we hook Supabase + webhooks for member gating.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email");

    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ← added
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (!r.ok || !data?.url) throw new Error(data?.error || "Failed to start checkout");

      // Off to Stripe Checkout
      window.location.href = data.url;
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Start Elite Access</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Your Name"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2"
          />

          <textarea
            name="goal"
            placeholder="Your Fitness Goals"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2"
          />

          {err && <p className="text-sm text-red-400">{err}</p>}

          <button
            disabled={loading}
            className="rounded-xl bg-teal-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-teal-400 disabled:opacity-50"
          >
            {loading ? "Starting checkout…" : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
