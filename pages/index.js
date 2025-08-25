// pages/index.js
import Head from 'next/head';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="page">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>WillpowerFitnessAI</title>
      </Head>

      <section className="hero">
        <img className="logo" src="/logo.png" alt="WillpowerFitnessAI" />
        <h1>High-performance coaching, white-glove.</h1>
        <p className="sub">Elite results. Cancel anytime.</p>

        {/* CTAs — go straight to checkout; no price on Join */}
        <div className="btnRow">
          <a href="/consult">
            <button className="btn btn--ghost">Start Free Consultation</button>
          </a>

          <a href="/checkout?intent=trial">
            <button className="btn btn--dark">Start Trial</button>
          </a>

          <a href="/checkout?intent=join">
            <button className="btn btn--light">Join Now</button>
          </a>

          {/* Brochure is a page */}
          <a href="/brochure">
            <button className="btn btn--ghost">View Brochure</button>
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
        .logo {
          height: 56px;
          opacity: 0.9;
          margin: .25rem auto 1rem;
          display: block;
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
        .btn--ghost { background: #111; color: #fff; }
        .btn--dark  { background: #1a1a1a; color: #fff; border-color: #1f1f1f; }
        .btn--light { background: #fff; color: #000; border-color: #fff; }

        .secure { font-size: 12px; opacity: .6; margin-top: 1rem; }

        @media (min-width: 520px) {
          .btnRow { grid-template-columns: repeat(4, max-content); justify-content: center; }
          .btn { width: auto; }
        }
        @media (max-width: 360px) {
          .logo { height: 44px; }
          .btn { padding: .8rem .9rem; }
        }
      `}</style>
    </main>
  );
}
