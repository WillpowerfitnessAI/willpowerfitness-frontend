// components/ChatBox.js
'use client';

import { useState } from 'react';
import MessageBubble from './MessageBubble.jsx'; // or './MessageBubble.js' if you rename it

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hey coach—what do you want to work on today?' },
  ]);
  const [input, setInput] = useState('');

  async function handleSend() {
    const userMsg = { role: 'user', text: input.trim() };
    if (!userMsg.text) return;

    setMessages((m) => [...m, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg).map(({ role, text }) => ({ role, content: text })),
          provider: process.env.NEXT_PUBLIC_LLM_PROVIDER || 'openai',
        }),
      });

      const data = await res.json();
      const reply = data?.reply || "Sorry—couldn’t reach the coach.";
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Network error. Please try again.' }]);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          className="input"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1 }}
        />
        <button className="btn btn--primary" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
