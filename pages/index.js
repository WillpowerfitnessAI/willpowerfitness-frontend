// /pages/index.js
import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Home() {
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({ name, goal })

      if (error) throw error
      // success → continue to subscribe
      window.location.href = '/subscribe'
    } catch (err) {
      console.error('Supabase error:', err)
      setErrorMsg('Something went wrong saving your info. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-xl px-6 py-16">
        <header>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to <span className="text-white">WillpowerFitness AI</span>
          </h1>
          <p className="mt-2 text-neutral-400">
            High-performance coaching. White-glove.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3
                         placeholder:text-neutral-500 focus:outline-none focus:ring-2
                         focus:ring-teal-500/50 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">
              Your Fitness Goals
            </label>
            <textarea
              placeholder="Your Fitness Goals"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
              rows={5}
              className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3
                         placeholder:text-neutral-500 focus:outline-none focus:ring-2
                         focus:ring-teal-500/50 focus:border-teal-500 resize-none"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl
                       bg-teal-500 px-5 py-3 font-medium text-neutral-900
                       hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60
                       transition-colors"
          >
            {loading ? 'Saving…' : 'Continue'}
          </button>

          <p className="text-center text-xs text-neutral-500">
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline hover:text-neutral-300">Terms</a>{' '}
            and{' '}
            <a href="/privacy" className="underline hover:text-neutral-300">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </main>
  )
}

