// lib/checkout.ts
import { loadStripe } from '@stripe/stripe-js';

const PK = (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').trim();
const PRICE_ID = (process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || '').trim();

export async function startCheckout(email?: string) {
  if (!PK) throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  if (!PRICE_ID) throw new Error('Missing NEXT_PUBLIC_STRIPE_PRICE_ID');

  const stripe = await loadStripe(PK);
  const successUrl = `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}${
    email ? `&email=${encodeURIComponent(email)}` : ''
  }`;
  const cancelUrl = `${window.location.origin}/subscribe?canceled=1`;

  const { error } = await stripe!.redirectToCheckout({
    mode: 'subscription',
    lineItems: [{ price: PRICE_ID, quantity: 1 }],
    customerEmail: email || undefined,
    allowPromotionCodes: true,
    successUrl,
    cancelUrl,
  });

  if (error) throw error;
}
