// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages = [], provider } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages[] is required' });
    }

    const chosen = (provider || process.env.LLM_PROVIDER || 'openai').toLowerCase();
    const isGroq = chosen === 'groq';

    const API_URL = isGroq
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    const API_KEY = isGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
    const MODEL   = isGroq
      ? (process.env.GROQ_MODEL   || 'llama-3.1-70b-versatile')
      : (process.env.OPENAI_MODEL || 'gpt-4o-mini');

    if (!API_KEY) {
      return res.status(400).json({ error: `Missing API key for ${isGroq ? 'GROQ_API_KEY' : 'OPENAI_API_KEY'}` });
    }

    const systemPrompt =
      "You are WillpowerFitness AI, a pragmatic, encouraging coach. Be concise and specific. " +
      "Ask clarifying questions when needed. Keep a friendly, no-nonsense tone.";

    const body = {
      model: MODEL,
      temperature: 0.6,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    };

    const r = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: 'LLM upstream error', details: text.slice(0, 2000) });
    }

    const data  = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || '';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('chat api error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
