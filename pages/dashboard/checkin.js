import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import RequireMember from "../../components/RequireMember";
import { supabase } from "../../utils/supabaseClient";

export default function CheckinPage() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ rpe: "", soreness: "", sleep_hours: "", weight_kg: "" });

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("checkins")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (!error) setList(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    // Attach user_id via RLS: supabase will set auth.uid() behind the scenes
    const payload = {
      rpe: form.rpe ? Number(form.rpe) : null,
      soreness: form.soreness ? Number(form.soreness) : null,
      sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
    };
    const { error } = await supabase.from("checkins").insert(payload);
    if (error) alert(error.message);
    else {
      setForm({ rpe: "", soreness: "", sleep_hours: "", weight_kg: "" });
      load();
    }
    setLoading(false);
  }

  return (
    <RequireMember>
      <Layout title="Check-in">
        <h1>Check-in</h1>

        <form onSubmit={submit} className="card" style={{ marginTop: 12 }}>
          <div className="grid grid-2">
            <label>
              <div className="label">RPE (1–10)</div>
              <input className="input" name="rpe" type="number" min="1" max="10" value={form.rpe} onChange={onChange} />
            </label>
            <label>
              <div className="label">Soreness (1–10)</div>
              <input className="input" name="soreness" type="number" min="1" max="10" value={form.soreness} onChange={onChange} />
            </label>
            <label>
              <div className="label">Sleep (hrs)</div>
              <input className="input" name="sleep_hours" type="number" step="0.1" value={form.sleep_hours} onChange={onChange} />
            </label>
            <label>
              <div className="label">Weight (kg)</div>
              <input className="input" name="weight_kg" type="number" step="0.1" value={form.weight_kg} onChange={onChange} />
            </label>
          </div>
          <button className="btn btn--primary" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Saving…" : "Save check-in"}
          </button>
        </form>

        <h2 style={{ marginTop: 24 }}>Recent</h2>
        <div className="card">
          {loading && !list.length ? <p className="muted">Loading…</p> : null}
          {!list.length ? <p className="muted">No entries yet.</p> : null}
          {list.map((c) => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 8, padding: "8px 0", borderBottom: "1px solid #222" }}>
              <div>{new Date(c.created_at).toLocaleDateString()}</div>
              <div>RPE {c.rpe ?? "—"}</div>
              <div>Soreness {c.soreness ?? "—"}</div>
              <div>Sleep {c.sleep_hours ?? "—"}h</div>
              <div>Weight {c.weight_kg ?? "—"}kg</div>
            </div>
          ))}
        </div>
      </Layout>
    </RequireMember>
  );
}
