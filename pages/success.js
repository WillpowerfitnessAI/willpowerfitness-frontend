import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Get the paid session's email (verified server-side)
  useEffect(() => {
    if (!session_id) return;
    (async () => {
      try {
        const r = await fetch(`/api/confirm?session_id=${session_id}`);
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Unable to confirm payment");
        setEmail(data.email || "");
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [session_id]);

  async function handleCreateAccount(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await fetch("/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id, name, goal, password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Account creation failed");

      // Account created. Send them to login to use email+password.
      window.location.href = "/login";
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-md px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Complete Your Account</h1>

        {email ? (
          <p className="mb-4 text-neutral-400">
            Payment confirmed for <span className="text-white font-semibold">{email}</span>.
          </p>
        ) : (
          <p className="mb-4 text-neutral-400">Checking payment…</p>
        )}

        <form onSubmit={handleCreateAccount} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2"
          />
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Your Fitness Goals"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Set a Password"
            required
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2"
          />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button
            disabled={loading || !email}
            className="rounded-xl bg-teal-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-teal-400 disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Account & Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}
