// pages/success.js
import { useEffect, useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "https://api.willpowerfitnessai.com").replace(/\/$/, "");

export default function Success() {
  const [member, setMember] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Try querystring first; if missing, fall back to what the user typed on /subscribe
    let e = "";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      e = params.get("email") || localStorage.getItem("wp_last_email") || "";
    }
    setEmail(e);
    if (!e) return; // nothing to poll

    let t;
    async function check() {
      try {
        const r = await fetch(`${API_BASE}/api/me?email=${encodeURIComponent(e)}`);
        const ct = r.headers.get("content-type") || "";
        const j = ct.includes("application/json") ? await r.json() : {};
        setMember(!!j.is_member);
        if (!j.is_member) t = setTimeout(check, 1500);
      } catch {
        t = setTimeout(check, 2000);
      }
    }
    check();
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold">
        {member ? "Welcome to Elite 🎉" : "Finalizing your membership…"}
      </h1>
      <p className="mt-3">
        {member ? (
          <a className="underline" href="/login">Continue to login</a>
        ) : (
          "Hang tight a moment while we confirm your subscription."
        )}
      </p>
    </main>
  );
}
