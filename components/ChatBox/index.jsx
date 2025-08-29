// components/ChatBox/index.jsx
import { useState } from 'react';

export default function ChatBox({ onSend, apiBase }) {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState([
    "Welcome. What's your fitness big objective?",
  ]);

  const add = (s) => setLines((prev) => [...prev, s]);

  async function defaultSend(message, email) {
    const BASE =
      (apiBase ||
        process.env.NEXT_PUBLIC_API_BASE ||
        process.env.NEXT_PUBLIC_API_BASE_URL || // fallback if you still have this var
        'https://api.willpowerfitnessai.com'
      ).replace(/\/$/, '');

    const res = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, email }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Chat failed (${res.status})`);
    }
    const data = await res.json();
    return data.reply;
  }

  async function handleSend() {
    const msg = input.trim();
    if (!msg || busy) return;

    setInput('');
    add(msg);

    try {
      setBusy(true);
      const sender = typeof onSend === 'function' ? onSend : defaultSend;
      const reply = await sender(msg);
      add(reply || '…');
    } catch (e) {
      console.error(e);
      add('Sorry—something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <textarea
        value={lines.join('\n')}
        readOnly
        rows={10}
        style={{
          width: '100%',
          background: '#111',
          color: '#fff',
          padding: 8,
          borderRadius: 8,
          border: '1px solid #444',
        }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={busy}>
          {busy ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
