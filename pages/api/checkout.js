// /pages/api/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Missing email" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email, // capture buyer email
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      // IMPORTANT: redirect to /success with the checkout session id
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/subscribe?cancelled=1`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
