// components/ChatBox.jsx
import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Welcome. What’s your fitness big objective?' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      // TODO: swap to your real API endpoint
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: data.reply ?? 'OK.' }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Sorry—something went wrong. Try again.' }
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div
        ref={listRef}
        style={{
          height: 320,
          overflowY: 'auto',
          border: '1px solid #eee',
          borderRadius: 12,
          padding: 12,
          marginBottom: 12
        }}
      >
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} />
        ))}
      </div>

      <form onSubmit={sendMessage}>
        <div className="flex" style={{ gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={sending ? 'Sending…' : 'Type a message'}
            disabled={sending}
            className="input"
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" disabled={sending}>
            {sending ? '…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
