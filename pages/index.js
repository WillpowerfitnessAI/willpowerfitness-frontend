// pages/index.js
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const TRIAL_LINK =
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_2DAY ||
    "https://buy.stripe.com/eVq6oIeVC4oZdTY6gdb3q00"; // your 2-day link (kept as fallback)

  const startConsult = () => router.push("/consultation?trial=2");
  const startTrial = () => (window.location.href = TRIAL_LINK);

  return (
    <main className="hero">
      {/* top nav can link to /login and /join */}
      {/* ... your layout ... */}

      <div className="cta-row">
        <button onClick={startConsult}>Start free consultation</button>
        <button onClick={startTrial}>Start Trial</button>
      </div>
    </main>
  );
}

