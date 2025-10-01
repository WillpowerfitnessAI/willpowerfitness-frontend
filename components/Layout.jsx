// /components/Layout.jsx
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.png"; // make sure /public/logo.png exists

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* SEO + Favicons (works on all pages) */}
      <Head>
        <title>WillpowerFitness AI</title>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
        {/* (Optional) If you have these in /public, uncomment them:
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        */}
      </Head>

      {/* gentle background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-20%,rgba(45,212,191,0.18),transparent_60%)]" />

      {/* Header: logo left, Member Login right */}
      <header className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="WillpowerFitness AI"
            priority
            className="h-9 w-auto sm:h-10"
            sizes="(max-width: 640px) 36px, 40px"
          />
          <span className="text-sm font-semibold text-neutral-300">
            WillpowerFitness AI
          </span>
        </div>

        <nav className="text-sm">
          <Link className="text-neutral-300 hover:text-white" href="/login">
            Member Login
          </Link>
        </nav>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</main>

      {/* Footer: centered, no divider line */}
      <footer className="mx-auto w-full max-w-6xl px-4 sm:px-6 mt-16 pb-10 text-center text-xs text-neutral-500">
        <p>© 2025 Willpowerfitness. All rights reserved.</p>
        <p className="mt-2">
          Information provided is for educational purposes only and is not medical
          advice. Consult your physician before beginning any exercise or nutrition program.
        </p>
        <p className="mt-2">
          <Link href="/terms" className="underline hover:text-neutral-300">Terms</Link>{" · "}
          <Link href="/privacy" className="underline hover:text-neutral-300">Privacy</Link>
        </p>
      </footer>
    </div>
  );
}

