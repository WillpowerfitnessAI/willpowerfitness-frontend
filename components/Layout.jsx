// components/Layout.jsx
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ title = 'WillpowerFitnessAI', children }) {
  const pageTitle = title ? `${title} · WillpowerFitnessAI` : 'WillpowerFitnessAI';

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>

        {/* Icons / Mobile homescreen */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <header className="site-header">
        <Link href="/" className="brand" aria-label="WillpowerFitnessAI home">
          {/* Use the asset that exists in /public */}
          <img src="/logo.png" alt="WillpowerFitnessAI" height="28" />
          <span className="brand-text">WillpowerFitnessAI</span>
        </Link>

        <nav className="nav">
          <Link href="/login" className="btn btn-outline sm">Login</Link>
          <Link href="/dashboard" className="btn sm">Dashboard</Link>
        </nav>
      </header>

      <main>{children}</main>

      <style jsx>{`
        .site-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: inherit;
        }
        .brand img {
          height: 28px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .brand-text { font-size: 0.95rem; color: #9aa0a6; }
        .nav { display: flex; gap: 8px; }
        .btn {
          background: #fff; color: #000; border: 1px solid #fff;
          padding: 8px 12px; border-radius: 10px; text-decoration: none;
        }
        .btn.sm { padding: 7px 10px; font-size: .92rem; }
        .btn-outline { background: transparent; color: #fff; border-color: #444; }
        @media (max-width: 640px) {
          .site-header { padding: 10px 12px; }
          .brand-text { display: none; }
          .brand img { height: 24px; }
        }
      `}</style>
    </>
  );
}

