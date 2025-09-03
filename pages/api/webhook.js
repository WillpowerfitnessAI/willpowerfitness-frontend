// pages/api/webhook.js
import Stripe from "stripe";
import getRawBody from "raw-body";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const rawBody = await getRawBody(req); // Buffer
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // make sure this is set in Vercel
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle events you care about
  if (event.type === "checkout.session.completed") {
    // (optional) Do something immediately when Stripe confirms payment
  }

  return res.json({ received: true });
}
