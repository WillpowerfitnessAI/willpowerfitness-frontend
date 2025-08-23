// pages/index.js
import Head from "next/head";

const TRIAL_URL =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "/api/start-checkout?trial=2";

export default function Home() {
  return (
    <>
      <Head>
        <title>WillpowerFitness AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="nav">
        <div className="brand">
          {/* If your logo filename is different, update the src (e.g. /WWV-LOGO.png) */}
          <img src="/logo.png" alt="WillpowerFitness AI" />
        </div>

        <nav className="links">
          <a className="link" href="/login">Login</a>
          <a className="btn join" href="/join">Join now</a>
        </nav>
      </header>

      <main className="hero">
        <div className="ctaRow">
          <a className="btn primary" href="/consultation">
            Start free consultation
          </a>

          <a className="btn secondary" href={TRIAL_URL}>
            Start Trial
          </a>
        </div>
      </main>

      <style jsx>{`
        :global(html, body, #__next) {
          height: 100%;
        }
        body {
          margin: 0;
          background: #000;
          color: #fff;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
        }
        .nav {
          position: sticky;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: rgba(0, 0, 0, 0.8);
          border-bottom: 1px solid #111;
        }
        .brand img {
          height: 36px; /* adjust if you want bigger */
          width: auto;
          display: block;
        }
        .links {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .link {
          color: #bbb;
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 10px;
        }
        .link:hover {
          color: #fff;
          background: #111;
        }
        .btn {
          display: inline-block;
          text-decoration: none;
          border-radius: 28px;
          padding: 14px 22px;
          font-weight: 600;
          transition: transform 120ms ease, background 120ms ease, color 120ms ease,
            border-color 120ms ease;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .btn.join {
          background: #fff;
          color: #000;
        }
        .btn.join:hover {
          background: #eaeaea;
        }

        .hero {
          min-height: calc(100vh - 70px);
          display: grid;
          place-items: center;
          padding: 24px;
        }
        .ctaRow {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .primary {
          background: #fff;
          color: #000;
          border: 1px solid #fff;
        }
        .primary:hover {
          background: #eaeaea;
        }
        .secondary {
          background: #1c1c1c;
          color: #fff;
          border: 1px solid #383838;
        }
        .secondary:hover {
          background: #232323;
          border-color: #4a4a4a;
        }

        @media (max-width: 520px) {
          .btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
