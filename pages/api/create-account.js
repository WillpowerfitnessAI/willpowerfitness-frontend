// pages/api/create-account.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    let { email, password, name } = req.body || {};
    email = (email || '').trim().toLowerCase();
    name = (name || '').trim();

    if (!email || !password) {
      return res.status(400).json({ error: 'email_and_password_required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'weak_password' });
    }

    const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://api.willpowerfitnessai.com').replace(/\/$/, '');

    const upstream = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const text = await upstream.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { error: text || 'invalid_upstream_response' };
    }

    return res.status(upstream.status).json(json);
  } catch (e) {
    return res.status(500).json({ error: e.message || 'proxy_failed' });
  }
}

