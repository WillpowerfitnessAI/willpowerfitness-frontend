// /pages/subscribe.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { startBackendCheckout } from "../lib/checkout";

// Optional: instant bypass via Payment Link (for testing only).
const USE_PAYMENT_LINK =
  (process.env.NEXT_PUBLIC_USE_PAYMENT_LINK || "")
    .toString()
    .toLowerCase() === "1" ||
  (process.env.NEXT_PUBLIC_USE_PAYMENT_LINK || "")
    .toString()
    .toLowerCase() === "true";

const STRIPE_PAYMENT_LINK = (process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "").trim();

export default function SubscribePage() {
  const router = useRouter();
  const { email: qEmail, intent = "join" } = router.query || {};

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ---------------- Anti-autofill + clear on mount ----------------
  useEffect(() => {
    setName("");
    setGoal("");
    setEmail("");
    setPassword("");
    try {
      // if we ever persisted anything locally in earlier versions, wipe it
      localStorage.removeItem("subscribeForm");
    } catch {}
  }, []);

  // If coming from /success prefill the email from query string (readonly)
  useEffect(() => {
    if (typeof qEmail === "string" && qEmail.includes("@")) setEmail(qEmail);
  }, [qEmail]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      // Remember last email purely for /success recovery (Stripe sometimes omits it)
      try {
        localStorage.setItem("wp_last_email", email || "");
      } catch {}

      // 0) Optional Payment Link bypass (testing only)
      if (USE_PAYMENT_LINK && STRIPE_PAYMENT_LINK) {
        const u = new URL(STRIPE_PAYMENT_LINK);
        if (email) u.searchParams.set("prefilled_email", email);
        window.location.href = u.toString();
        return;
      }

      // 1) Backend-driven Stripe Checkout (redirects to Stripe)
      await startBackendCheckout({
        email: (email || "").trim().toLowerCase(),
        name,
        goal,
        intent: intent || "join",
      });
    } catch (error) {
      setErr(error?.message || "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <h1 className="mb-6 text-3xl font-bold">Start Elite Access</h1>

      {/* Turn off browser autofill, and use non-standard names on inputs */}
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4" autoComplete="off">
        <div>
          <label className="mb-1 block text-sm">Full name</label>
          <input
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Willie Owens"
            disabled={loading}
            autoComplete="off"
            name="wfs-name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Your primary goal</label>
          <textarea
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="weight loss"
            rows={3}
            disabled={loading}
            autoComplete="off"
            name="wfs-goal"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading || !!qEmail}
            readOnly={!!qEmail}
            autoComplete="off"
            inputMode="email"
            name="wfs-email"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            type="password"
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="new-password"
            name="wfs-pass"
          />
          <p className="mt-1 text-xs text-white/60">
            (Password isn’t required for checkout—account was created on the previous step.)
          </p>
        </div>

        {err ? <p className="text-sm text-red-400">{err}</p> : null}

        <button
          type="submit"
          className="rounded-md bg-teal-500 px-5 py-2 font-medium hover:bg-teal-600 disabled:opacity-60"
          disabled={loading || !email}
        >
          {loading ? "Redirecting..." : "Continue"}
        </button>
      </form>
    </main>
  );
}
