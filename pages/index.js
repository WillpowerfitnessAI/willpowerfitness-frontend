// pages/index.js
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ name, goal }])   // array form + safe
        .select();                  // return inserted rows

      if (error) throw error;
      console.log('Saved:', data);
      window.location.href = '/subscribe'; // keep it simple
    } catch (err) {
      console.error('Supabase insert failed:', err);
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
