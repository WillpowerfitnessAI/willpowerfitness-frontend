// /pages/api/checkout.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "https://api.willpowerfitnessai.com").replace(/\/$/, "");

  try {
    const upstream = await fetch(`${API_BASE}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body || {}),
    });

    const text = await upstream.text();
    let json;
    try { json = text ? JSON.parse(text) : {}; }
    catch { json = { error: text || "invalid_upstream_response" }; }

    res.status(upstream.status).json(json);
  } catch (e) {
    res.status(500).json({ error: e?.message || "proxy_failed" });
  }
}
