// pages/api/chat.js
import OpenAI from "openai";

export const config = { runtime: "nodejs" }; // works fine on Vercel

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages = [] } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] is required" });
    }

    // Expecting items like: { role: "user"|"assistant"|"system", text: "..." }
    const input = messages.map(m => ({ role: m.role, content: m.text }));

    const resp = await client.responses.create({
      model: "gpt-5",            // or "gpt-5-mini" to save cost/latency
      input
    });

    const reply = resp.output_text ?? "";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Chat failed." });
  }
}
