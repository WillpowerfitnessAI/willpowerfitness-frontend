// /pages/api/consult.js  (temporary smoke test)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // GET should return JSON here
    return res.status(200).json({ ok: true, route: "/api/consult", method: req.method });
  }
  // POST: send the client to checkout stub
  return res.status(200).json({ ok: true, next: "/api/start-checkout?trial=2", note: "stub" });
}
