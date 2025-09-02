// pages/subscribe.js
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Subscribe() {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const goal = form.get("goal");
    const email = form.get("email");
    const password = form.get("password");

    // create the user (email+password) and attach metadata
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, goal } },
    });

    setLoading(false);
    if (error) return setErr(error.message);

    // simple redirect after signup
    window.location.href = "/success.html";
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Start Elite Access</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Your Name" className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2" />
          <textarea name="goal" placeholder="Your Fitness Goals" className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2" />
          <input name="email" type="email" placeholder="Email" required className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2" />
          <input name="password" type="password" placeholder="Password" required className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2" />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button disabled={loading} className="rounded-xl bg-teal-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-teal-400 disabled:opacity-50">
            {loading ? "Creating…" : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}

