// /pages/api/chat.js
export const config = { runtime: 'nodejs' };

import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use your org-approved model here. Safe default:
const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages = [] } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages[] is required' });
    }

    // Expecting messages like: [{ role: 'user'|'assistant'|'system', text: '...' }, ...]
    const input = messages.map(m => ({ role: m.role, content: m.text }));

    const r = await client.responses.create({
      model: MODEL,
      input,
    });

    const reply =
      r.output_text ??
      (r.output?.[0]?.content?.[0]?.text ?? '');

    return res.status(200).json({ reply });
  } catch (e) {
    console.error('chat error:', e);
    return res.status(500).json({
      error: 'chat_failed',
      detail: String(e?.message || e),
    });
  }
}

  
