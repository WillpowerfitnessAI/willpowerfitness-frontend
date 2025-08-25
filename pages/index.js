// pages/index.js
import Head from 'next/head';
import Image from 'next/image';
import Footer from '../components/Footer';

export default function Home() {
  const buyUrl   = process.env.NEXT_PUBLIC_STRIPE_BUY_URL;
  const trialUrl = process.env.NEXT_PUBLIC_STRIPE_TRIAL_URL;

  return (
    <main className="page">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>WillpowerFitnessAI</title>
      </Head>

      <section className="hero">
        {/* Logo (Next/Image for better caching & DPR handling) */}
        <div className="logoWrap">
          <Image
            src="/logo.png"              // served from /public/logo.png
            alt="WillpowerFitnessAI"
            width={48}
            height={48}
            priority
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        <h1>High-performance coaching, white-glove.</h1>
        <p className="sub">Elite results. Cancel anytime.</p>

        <div className="btnRow">
          <a href="/consult">
            <button className="btn btn--ghost">Start Free Consultation</button>
          </a>

          <a href={trialUrl || "#"}>
            <button className="btn btn--dark" disabled={!trialUrl}>
              Start Trial
            </button>
          </a>

          <a href={buyUrl || "#"}>
            <button className="btn btn--light" disabled={!buyUrl}>
              Join Now — $225/mo
            </button>
          </a>

        <a href="/brochure.pdf" download>
            <button className="btn btn--ghost">Download Brochure (PDF)</button>
          </a>
        </div>

        <p className="secure">Secure checkout via Stripe.</p>
      </section>

      <Footer />

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
          display: grid;
          grid-template-rows: 1fr auto;
        }
        .hero {
          max-width: 780px;
          margin: 0 auto;
          text-align: center;
          padding: 2.25rem 1rem 3rem;
        }

        /* Logo wrapper (works well with next/image) */
        .logoWrap {
          margin: .25rem auto 1rem;
          opacity: .9;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Style the actual <img> inside next/image */
        .logoWrap :global(img) {
          height: 56px;
          width: auto;
        }

        h1 {
          font-size: clamp(2rem, 6vw, 3.1rem);
          line-height: 1.12;
          margin: 0.75rem 0 .5rem;
        }
        .sub {
          opacity: .8;
          margin: 0 0 1.25rem;
          font-size: clamp(.95rem, 1.9vw, 1.05rem);
        }

        /* Buttons: mobile first */
        .btnRow {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          justify-content: center;
          align-items: center;
          margin-top: .5rem;
        }
        .btn {
          width: 100%;
          padding: .9rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          border: 1px solid #444;
        }
        .btn[disabled] { opacity: .5; cursor: not-allowed; }
        .btn--ghost { background: #111; color: #fff; }
        .btn--dark  { background: #1a1a1a; color: #fff; border-color: #1f1f1f; }
        .btn--light { background: #fff; color: #000; border-color: #fff; }

        .secure { font-size: 12px; opacity: .6; margin-top: 1rem; }

        /* Small tablets: 2 columns */
        @media (min-width: 520px) {
          .btnRow { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        /* Desktop/tablet wide: inline buttons */
        @media (min-width: 768px) {
          .btnRow { grid-template-columns: repeat(4, max-content); justify-content: center; }
          .btn { width: auto; }
        }

        /* Very small phones */
        @media (max-width: 360px) {
          .logoWrap { height: 44px; }
          .logoWrap :global(img) { height: 44px; }
          .btn { padding: .8rem .9rem; }
        }
      `}</style>
    </main>
  );
}
