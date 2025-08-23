// pages/index.js
import Head from "next/head";
import Link from "next/link";

const TRIAL_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
  "https://buy.stripe.com/eVq6oIeVC4oZdTY6gdb3q00"; // your 2-day free trial link

export default function Home() {
  return (
    <>
      <Head>
        <title>WillpowerFitness AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Use existing logo so there's no favicon 404 */}
        <link rel="icon" href="/logo.png" />
      </Head>

      <main
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <Link
            href="/consultation"
            style={{
              padding: "12px 18px",
              borderRadius: 9999,
              background: "#fff",
              color: "#000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Start free consultation
          </Link>

          <a
            href={TRIAL_LINK}
            style={{
              padding: "12px 18px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              textDecoration: "none",
            }}
          >
            Start Trial
          </a>
        </div>
      </main>
    </>
  );
}
