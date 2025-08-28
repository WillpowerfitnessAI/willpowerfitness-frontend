// components/Layout.jsx
import Head from "next/head";
import Link from "next/link";

export default function Layout({ title, children }) {
  const pageTitle = title ? `${title} · WillpowerFitnessAI` : "WillpowerFitnessAI";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* favicons for desktop + mobile */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </Head>

      <header className="site-header">
        <Link href="/" className="brand" aria-label="WillpowerFitnessAI home">
          {/* Use whatever you have: /logo.svg, /logo.png, etc. */}
          <img src="/logo.svg" alt="" height="28" />
          <span>WillpowerFitnessAI</span>
        </Link>
        <nav className="nav">
          <Link href="/login" className="btn btn-outline sm">Login</Link>
          <Link href="/dashboard" className="btn sm">Dashboard</Link>
        </nav>
      </header>

      <main>{children}</main>

      <style jsx>{`
        .site-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .brand { display:flex; align-items:center; gap:10px; text-decoration:none; color:inherit; }
        .brand img { width:28px; height:28px; object-fit:contain; }
        .nav { display:flex; gap:8px; }
        .btn.sm { padding:6px 10px; font-size:.9rem; }
        @media (max-width:640px){ .site-header{ padding:10px 12px; } }
      `}</style>
    </>
  );
}
