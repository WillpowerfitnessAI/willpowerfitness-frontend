// pages/subscribe.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";

// ---- ENV ----
const PK = (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "").trim();
const PRICE_ID = (process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "").trim();

// Optional: instant bypass via Payment Link (no Stripe.js needed)
const USE_PAYMENT_LINK =
  (process.env.NEXT_PUBLIC_USE_PAYMENT_LINK || "").toString().toLowerCase() === "1" ||
  (process.env.NEXT_PUBLIC_USE_PAYMENT_LINK || "").toString().toLowerCase() === "true";
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

  useEffect(() => {
    if (typeof qEmail === "string" && qEmail.includes("@")) setEmail(qEmail);
  }, [qEmail]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      // Remember last email so /success can recover it if Stripe doesn't echo it back
      try { localStorage.setItem("wp_last_email", email || ""); } catch {}

      // 0) Optional: Payment Link bypass
      if (USE_PAYMENT_LINK && STRIPE_PAYMENT_LINK) {
        const u = new URL(STRIPE_PAYMENT_LINK);
        if (email) u.searchParams.set("prefilled_email", email);
        window.location.href = u.toString();
        return;
      }

      // 1) Guard rails
      if (!PK) throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      if (!PRICE_ID) throw new Error("Missing NEXT_PUBLIC_STRIPE_PRICE_ID");

      // 2) Client-only Stripe Checkout
      const stripe = await loadStripe(PK);
      const successUrl = `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
      const cancelUrl = `${window.location.origin}/subscribe?canceled=1`;

      const { error } = await stripe.redirectToCheckout({
        mode: "subscription",
        lineItems: [{ price: PRICE_ID, quantity: 1 }],
        successUrl,
        cancelUrl,
        customerEmail: email || undefined,
        allowPromotionCodes: true,
      });

      if (error) throw error;
    } catch (e) {
      setErr(e?.message || "Checkout failed");
      setLoading(false); // only stop spinner if we didn’t navigate away
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6">Start Elite Access</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm mb-1">Full name</label>
          <input
            className="w-full rounded-md px-3 py-2 bg-black/40 border border-white/10 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Willie Owens"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Your primary goal</label>
          <textarea
            className="w-full rounded-md px-3 py-2 bg-black/40 border border-white/10 outline-none"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="weight loss"
            rows={3}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded-md px-3 py-2 bg-black/40 border border-white/10 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading || !!qEmail}
            readOnly={!!qEmail}
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
            disabled={loading}
          />
          <p className="text-xs text-white/60 mt-1">
            (Password isn’t required for checkout—account was created on the previous step.)
          </p>
        </div>

        {err ? <p className="text-red-400 text-sm">{err}</p> : null}

        <button
          type="submit"
          className="rounded-md bg-teal-500 hover:bg-teal-600 px-5 py-2 font-medium disabled:opacity-60"
          disabled={loading || !email}
        >
          {loading ? "Redirecting..." : "Continue"}
        </button>
      </form>
    </main>
  );
}
