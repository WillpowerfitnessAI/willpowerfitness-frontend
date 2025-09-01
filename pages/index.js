// /pages/index.js
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* soft brand glow behind content */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-20%,rgba(45,212,191,0.18),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* === Header with logo === */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Use *your* exact filename. If you renamed to logo.png, change src below to "/logo.png" */}
            <Image
              src="/WYW-LOGO.png"
              alt="WillpowerFitness AI"
              width={210}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </div>
          <nav className="hidden gap-6 text-sm text-neutral-300 md:flex">
            <Link href="/features" legacyBehavior><a className="hover:text-white">Features</a></Link>
            <Link href="/login" legacyBehavior><a className="hover:text-white">Member Login</a></Link>
            <Link href="/brochure" legacyBehavior><a className="hover:text-white">Brochure</a></Link>
          </nav>
        </header>

        {/* === Hero === */}
        <section className="mt-14 max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Elite AI Personal Training.
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Precision. Accountability. Results.
            </span>
          </h1>
          <p className="mt-5 text-lg text-neutral-400">
            White-glove coaching powered by data. Cancel anytime.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {/* Buttons that actually navigate */}
            <Link href="/subscribe" legacyBehavior>
              <a className="rounded-xl bg-teal-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-teal-400 transition-colors">
                Start Elite Access
              </a>
            </Link>
            <Link href="/login" legacyBehavior>
              <a className="rounded-xl border border-white/15 px-6 py-3 hover:bg-white/10 transition-colors">
                Log in
              </a>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card title="Smart Plans" body="Adaptive programs that evolve with your performance." />
            <Card title="Coach Check-ins" body="Structured accountability and course-corrections." />
            <Card title="Progress Intel" body="Trends, insights, and next best actions." />
          </div>
        </section>

        {/* === Footer with 2025 + disclaimer === */}
        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-neutral-500">
          <p>© 2025 Willpowerfitness. All rights reserved.</p>
          <p className="mt-2">
            Disclaimer: Information provided is for educational purposes only and is not medical advice. 
            Consult your physician before beginning any exercise or nutrition program.
          </p>
          <p className="mt-2">
            <Link href="/terms" legacyBehavior><a className="underline hover:text-neutral-300">Terms</a></Link>
            {" · "}
            <Link href="/privacy" legacyBehavior><a className="underline hover:text-neutral-300">Privacy</a></Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

function Card({ title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-400">{body}</p>
    </div>
  );
}
