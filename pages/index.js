// /pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full bg-black">
      {/* soft radial accent, mobile-safe */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-20%,rgba(45,212,191,0.18),transparent_60%)]" />

      <div className="w-full px-4 sm:px-6 lg:px-10 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Elite AI Personal Training.
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Precision. Accountability. Results.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-white/80 max-w-2xl">
            White-glove coaching powered by data. Cancel anytime.
          </p>

          <div className="mt-6 sm:mt-8">
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-teal-400 transition-colors"
            >
              Start Elite Access
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card
              title="Smart Plans"
              body="Adaptive programs that evolve with your performance."
            />
            <Card
              title="Coach Check-ins"
              body="Structured accountability and course-corrections."
            />
            <Card
              title="Progress Intel"
              body="Trends, insights, and next best actions."
            />
          </div>
        </div>
      </div>
    </section>
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
