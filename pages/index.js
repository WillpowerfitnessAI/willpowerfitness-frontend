import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Home() {
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('clients')
      .insert({ name, goal })
    if (error) console.error('Supabase error:', error)
    else {
      console.log('Saved:', data)
      window.location.href = '/subscribe'
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to WillpowerFitness AI</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ display: 'block', margin: '0.5rem 0' }}
        />
        <textarea
          placeholder="Your Fitness Goals"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          required
          style={{ display: 'block', margin: '0.5rem 0' }}
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  )
}
