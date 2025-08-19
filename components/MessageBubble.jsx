import React from 'react';

export default function MessageBubble({ role, text }) {
  const isUser = role === 'user';
  return (
    <div className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`${isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} px-4 py-2 rounded-lg`}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {text}
      </div>
    </div>
  );
}
