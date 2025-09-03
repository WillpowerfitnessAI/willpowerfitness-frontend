// /pages/index.js
import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.png"; // make sure the file name is exactly "logo.png"

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-20%,rgba(45,212,191,0.18),transparent_60%)]" />

      {/* MOBILE-FIRST CONTAINER */}
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-10">
        {/* === Header with working logo === */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              alt="WillpowerFitness AI"
              priority
              className="h-8 w-auto sm:h-10"
              sizes="(max-width: 640px) 32px, 40px"
            />
            <span className="block text-xs font-semibold text-neutral-300 sm:text-sm">
              WillpowerFitness AI
            </span>
          </div>

          {/* Only link to routes you actually have */}
          <nav className="hidden gap-6 text-sm text-neutral-300 md:flex">
            <Link href="/login" className="hover:text-white">Member Login</Link>
            <Link href="/brochure" className="hover:text-white">Brochure</Link>
          </nav>
        </header>

        {/* === Hero === */}
        <section className="mt-10">
          <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-left sm:text-5xl">
            Elite AI Personal Training.
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Precision. Accountability. Results.
            </span>
          </h1>
          <p className="mt-4 text-center text-base text-neutral-400 sm:text-left">
            White-glove coaching powered by data. Cancel anytime.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-6 py-3
                         font-semibold text-neutral-900 hover:bg-teal-400 transition-colors"
            >
              Start Elite Access
            </Link>
            {/* removed duplicate hero Log in button */}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card title="Smart Plans" body="Adaptive programs that evolve with your performance." />
            <Card title="Coach Check-ins" body="Structured accountability and course-corrections." />
            <Card title="Progress Intel" body="Trends, insights, and next best actions." />
          </div>
        </section>

        {/* === Footer === */}
        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-neutral-500">
          <p>© 2025 Willpowerfitness. All rights reserved.</p>
          <p className="mt-2">
            Disclaimer: Information provided is for educational purposes only and is not medical advice.
            Consult your physician before beginning any exercise or nutrition program.
          </p>
          <p className="mt-2">
            <Link href="/terms" className="underline hover:text-neutral-300">Terms</Link>{" · "}
            <Link href="/privacy" className="underline hover:text-neutral-300">Privacy</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

function Card({ title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-400">{body}</p>
    </div>
  );
}
