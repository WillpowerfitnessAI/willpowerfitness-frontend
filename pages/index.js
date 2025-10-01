// /pages/index.js
import Link from "next/link";

function Card({ title, body }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-400">{body}</p>
    </div>
  );
}

export default function Home() {
  return (
    <section className="py-6 sm:py-10">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        Elite AI Personal Training.
        <br />
        <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          Precision. Accountability. Results.
        </span>
      </h1>

      <p className="mt-4 text-base text-neutral-400">
        White-glove coaching powered by data. Cancel anytime.
      </p>

      <div className="mt-8">
        <Link
          href="/subscribe"
          className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-6 py-3 font-semibold text-neutral-900 hover:bg-teal-400 transition-colors"
        >
          Start Elite Access
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card title="Smart Plans" body="Adaptive programs that evolve with your performance." />
        <Card title="Coach Check-ins" body="Structured accountability and course-corrections." />
        <Card title="Progress Intel" body="Trends, insights, and next best actions." />
      </div>
    </section>
  );
}
