export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "https://api.willpowerfitnessai.com").replace(/\/$/, "");

export async function startBackendCheckout(
  payload: { email: string; name?: string; goal?: string; intent?: string }
) {
  const res = await fetch(`${API_BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Read as text first; parse JSON only if present
  const raw = await res.text();
  const data = raw ? (() => { try { return JSON.parse(raw); } catch { return { error: raw }; } })() : {};

  if (!res.ok) {
    throw new Error((data && (data.error || data.message)) || `HTTP ${res.status}`);
  }
  if (!data?.url) {
    throw new Error("No checkout URL returned");
  }
  window.location.href = data.url; // Stripe Checkout
}
