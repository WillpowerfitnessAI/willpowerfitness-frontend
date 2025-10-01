// /lib/checkout.ts
const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "https://api.willpowerfitnessai.com").replace(/\/$/, "");

export async function startBackendCheckout(params: {
  email: string;
  name?: string;
  goal?: string;
  intent?: string;
}) {
  const { email, name, goal, intent = "join" } = params;

  // Validate email (extra guard)
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error("Please enter a valid email.");
  }

  // POST to backend
  const res = await fetch(`${API_BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, goal, intent }),
  });

  const raw = await res.text();
  let payload: any = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    throw new Error(raw || "Invalid response from server");
  }

  if (!res.ok) {
    throw new Error(payload?.message || payload?.error || `HTTP ${res.status}`);
  }

  if (!payload?.url) {
    throw new Error("No URL returned from checkout");
  }

  // Redirect to Stripe
  window.location.href = payload.url;
}
