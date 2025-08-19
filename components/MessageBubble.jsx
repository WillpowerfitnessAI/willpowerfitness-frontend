// components/MessageBubble.jsx
import React from 'react';

export default function MessageBubble({ role, text }) {
  const mine = role === 'user';

  return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div
        style={{
          background: mine ? '#1f2937' : '#111827', // slate-ish vs near black
          color: '#fff',
          padding: '10px 12px',
          borderRadius: 12,
          maxWidth: '75%',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </div>
    </div>
  );
}
