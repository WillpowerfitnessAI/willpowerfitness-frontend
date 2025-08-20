// components/MessageBubble.jsx
import React from 'react';

export default function MessageBubble({ role, text }) {
  const mine = role === 'user';
  return (
    <div className={`mb-2 flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`${mine ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} px-4 py-2 rounded-lg`}
        style={{ whiteSpace: 'pre-wrap', maxWidth: '75%' }}
      >
        {text}
      </div>
    </div>
  );
}
