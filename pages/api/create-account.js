// /pages/api/create-account.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Safe for signUp: the anon key is intended for client-side use as well
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    // pull fields and normalize
    let { email, password, name } = req.body || {};
    email = (email || "").trim().toLowerCase();
    name = (name || "").trim();

    if (!email || !password) {
      return res.status(400).json({ error: "email_and_password_required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "weak_password" });
    }

    // Create the Supabase Auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // saved into user.user_metadata.name
        // If you’ve DISABLED email confirmations in Supabase Auth settings,
        // leave this as-is. If confirmations are ON, you can add:
        // emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/confirm`
      },
    });

    if (error) {
      // common codes: "user_already_exists", "email_rate_limit_exceeded", etc.
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      ok: true,
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "create_account_failed" });
  }
}

