import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Home() {
  const [name, setName]   = useState('')
  const [goal, setGoal]   = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const { error } = await supabase.from('clients').insert({ name, goal })
      if (error) throw error
      window.location.href = '/subscribe'
    } catch (err) {
      console.error(err)
      setErrorMsg('Could not save your info. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* decorative gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-20%,rgba(45,212,191,0.25),transparent_60%)]" />

      {/* Top nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="WillpowerFitness AI" className="h-9 w-9 rounded-full object-cover" />
          <span className="text-lg font-semibold">WillpowerFitness AI</span>
        </div>
        <nav className="hidden gap-6 text-sm text-neutral-300 md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="/login" className="hover:text-white">Member Login</a>
          <a href="/brochure" className="hover:text-white">Brochure</a>
        </nav>
      </header>

      {/* Hero + form */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-6 md:pt-12 lg:grid-cols-2">
        {/* Left: messaging */}
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            High-performance coaching,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
              white-glove.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-neutral-400">
            Elite results. Cancel anytime. No fluff—just data-driven training and accountability.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">AI programs</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Bi-weekly check-ins</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Progress tracking</span>
          </div>
        </div>

        {/* Right: form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
        >
          <h2 className="text-xl font-semibold">Get started</h2>
          <p className="mt-1 text-sm text-neutral-400">Tell us who you are and your goals.</p>

          <label className="mt-6 block text-sm font-medium text-neutral-300">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
            placeholder="Your Name"
            className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3
                       placeholder:text-neutral-500 focus:outline-none focus:ring-2
                       focus:ring-teal-500/50 focus:border-teal-500"
          />

          <label className="mt-6 block text-sm font-medium text-neutral-300">Your Fitness Goals</label>
          <textarea
            value={goal}
            onChange={(e)=>setGoal(e.target.value)}
            required
            rows={5}
            placeholder="Fat loss, strength, endurance—what are we building?"
            className="mt-2 w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3
                       placeholder:text-neutral-500 focus:outline-none focus:ring-2
                       focus:ring-teal-500/50 focus:border-teal-500"
          />

          {errorMsg && <p className="mt-3 text-sm text-red-400">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl
                       bg-gradient-to-r from-teal-400 to-emerald-400 px-5 py-3 font-semibold text-neutral-900
                       hover:from-teal-300 hover:to-emerald-300 transition-colors
                       disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Continue'}
          </button>

          <p className="mt-3 text-center text-xs text-neutral-500">
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline hover:text-neutral-300">Terms</a> and{' '}
            <a href="/privacy" className="underline hover:text-neutral-300">Privacy Policy</a>.
          </p>
        </form>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Feature title="Smart Plans" desc="Adaptive programs that evolve with your performance." emoji="⚡" />
          <Feature title="Coach Check-ins" desc="Structured accountability and course-corrections." emoji="🎯" />
          <Feature title="Progress Intel" desc="Trends, insights, and next best actions." emoji="📈" />
        </div>
      </section>

      <footer className="pb-10 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} WillpowerFitness AI. All rights reserved.
      </footer>
    </main>
  )
}

function Feature({ title, desc, emoji }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-3xl">{emoji}</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-neutral-400">{desc}</p>
    </div>
  )
}
