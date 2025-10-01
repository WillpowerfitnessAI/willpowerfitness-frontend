// /lib/checkout.ts
export async function startBackendCheckout(payload: {
  email: string; name?: string; goal?: string; intent?: string;
}) {
  // Call our same-origin proxy -> avoids CORS
  const res = await fetch(`/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  let data: any = null;
  try { data = raw ? JSON.parse(raw) : null; }
  catch { throw new Error(raw || "Invalid response from server"); }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }
  if (!data?.url) {
    throw new Error("No URL returned from checkout");
  }

  // Go to Stripe Checkout
  window.location.href = data.url;
}
