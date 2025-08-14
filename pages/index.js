// pages/index.js
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, goal }),
      });
      if (!r.ok) throw new Error(`API ${r.status}`);
      window.location.href = '/subscribe';
    } catch (err) {
      console.error('Lead submit failed:', err);
      alert('Could not save your info. Please try again.');
    } finally {
      setLoading(false);
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
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: 'block', margin: '0.5rem 0' }}
        />
        <textarea
          placeholder="Your Fitness Goals"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
          style={{ display: 'block', margin: '0.5rem 0' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Continue'}
        </button>
      </form>
    </div>
  );
}

