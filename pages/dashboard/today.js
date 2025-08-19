import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import RequireMember from "../../components/RequireMember";
import { supabase } from "../../utils/supabaseClient";

async function genPlanFromCheckins(checkins) {
  const last = checkins.slice(0, 7).map((c) => ({
    date: c.created_at,
    rpe: c.rpe, soreness: c.soreness, sleep: c.sleep_hours, weight: c.weight_kg
  }));

  const prompt = `You're an elite strength coach. Based on the last week’s check-ins below (date, RPE, soreness, sleep, weight), write **today’s training** in ~10 bullet lines. Keep it pragmatic, safe, and specific (sets/reps/RPE). End with 2 recovery tips.

Check-ins:
${last.map(c => `- ${new Date(c.date).toLocaleDateString()} | RPE:${c.rpe ?? "?"} soreness:${c.soreness ?? "?"} sleep:${c.sleep ?? "?"}h weight:${c.weight ?? "?"}kg`).join("\n")}
`;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "groq", // or "openai"
      messages: [
        { role: "system", content: "You are WillpowerFitness AI, a no-nonsense strength coach."},
        { role: "user", content: prompt }
      ]
    })
  });
  const j = await res.json();
  if (!res.ok || !j.ok) throw new Error(j.error || "AI error");
  return j.text || j.content || j.answer || "No plan.";
}

export default function TodayPage() {
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadAndGenerate() {
    setLoading(true);
    // Grab latest check-ins
    const { data } = await supabase
      .from("checkins")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(7);
    try {
      const p = await genPlanFromCheckins(data || []);
      setPlan(p);
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { loadAndGenerate(); }, []);

  async function savePlan() {
    setSaving(true);
    const { error } = await supabase.from("plans").insert({ content: plan });
    if (error) alert(error.message);
    else alert("Saved.");
    setSaving(false);
  }

  return (
    <RequireMember>
      <Layout title="Today’s Plan">
        <h1>Today’s Plan</h1>
        <p className="muted">Generated from your recent check-ins.</p>

        <div className="card" style={{ whiteSpace: "pre-wrap", minHeight: 160 }}>
          {loading ? "Thinking…" : plan || "No plan yet."}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button className="btn btn--outline" onClick={loadAndGenerate} disabled={loading}>
            {loading ? "Regenerating…" : "Regenerate"}
          </button>
          <button className="btn btn--primary" onClick={savePlan} disabled={!plan || saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </Layout>
    </RequireMember>
  );
}
