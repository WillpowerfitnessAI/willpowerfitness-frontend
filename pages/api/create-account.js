import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Admin client: service role key (server only!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { session_id, name, goal, password } = req.body || {};
    if (!session_id || !password) {
      return res.status(400).json({ error: "Missing session_id or password" });
    }

    // Re-verify payment
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return res.status(402).json({ error: "Payment not completed" });
    }

    const email = session.customer_details?.email || session.customer_email;
    if (!email) return res.status(400).json({ error: "No email on session" });

    // Create user with Admin API
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: name || "",
        goal: goal || "",
        stripe_customer_id: session.customer,
      },
    });
    if (error) return res.status(400).json({ error: error.message });

    // Optional: mark membership active in your profiles table
    // Requires a "profiles" table with id (uuid) = auth.users.id
    try {
      await supabaseAdmin.from("profiles").upsert({
        id: data.user.id,
        email,
        name: name || "",
        goal: goal || "",
        stripe_customer_id: session.customer,
        membership_active: true,
      });
    } catch (_) {}

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
