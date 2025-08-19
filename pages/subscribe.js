async function startTrial() {
  const r = await fetch("/api/checkout", { method: "POST" });
  const j = await r.json();
  if (j.url) window.location = j.url;
  else alert(j.error || "Checkout error");
}
<button className="btn btn--primary" onClick={startTrial}>Start Trial</button>
