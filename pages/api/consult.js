// pages/api/consult.js
import { getAdminClient } from "../../lib/supabaseAdmin"; // you already have this
export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, name, phone } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email is required" });

  const lead = { email };
  if (name) lead.name = name;
  if (phone) lead.phone = phone;

  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from("leads").insert([lead]);
    if (error) throw error;
  } catch (e) {
    console.error("Lead insert failed:", e.message);
    return res.status(500).json({ error: e.message });
  }

  // Fire-and-forget welcome email via Resend (no SDK import)
  try {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || "WillpowerFitness AI <no-reply@willpowerfitnessai.com>";
    if (key) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: "Welcome to WillpowerFitness AI",
          html: `<p>You're in! Next step: start your free trial to activate coaching.</p>`,
        }),
      });
    }
  } catch (e) {
    console.warn("Resend skipped:", e.message);
  }

  return res.status(200).json({ ok: true, message: "Saved", next: "/api/start-checkout?trial=2" });
}
