import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import RequireMember from "../../components/RequireMember";
import { supabase } from "../../utils/supabaseClient";

export default function ProgressPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("checkins")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(90);
      setRows(data || []);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const last7 = rows.slice(0, 7);
    const avg = (arr) => (arr.length ? (arr.reduce((a, b) => a + (b ?? 0), 0) / arr.length).toFixed(1) : "—");
    return {
      avgRPE: avg(last7.map((r) => r.rpe).filter((n) => n != null)),
      avgSoreness: avg(last7.map((r) => r.soreness).filter((n) => n != null)),
      avgSleep: avg(last7.map((r) => Number(r.sleep_hours)).filter((n) => !isNaN(n))),
      avgWeight: avg(last7.map((r) => Number(r.weight_kg)).filter((n) => !isNaN(n))),
      lastEntry: rows[0] || null,
    };
  }, [rows]);

  return (
    <RequireMember>
      <Layout title="Habits & Progress">
        <h1>Habits & Progress</h1>

        <div className="card" style={{ marginTop: 12 }}>
          {loading ? <p className="muted">Loading…</p> : null}
          <div className="grid grid-4">
            <div><strong>7-day avg RPE</strong><div>{stats.avgRPE}</div></div>
            <div><strong>7-day avg Soreness</strong><div>{stats.avgSoreness}</div></div>
            <div><strong>7-day avg Sleep</strong><div>{stats.avgSleep} h</div></div>
            <div><strong>7-day avg Weight</strong><div>{stats.avgWeight} kg</div></div>
          </div>
        </div>

        <h2 style={{ marginTop: 24 }}>Latest entries</h2>
        <div className="card">
          {!rows.length ? <p className="muted">No data yet.</p> : rows.map((r) => (
            <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 8, padding: "8px 0", borderBottom: "1px solid #222" }}>
              <div>{new Date(r.created_at).toLocaleDateString()}</div>
              <div>RPE {r.rpe ?? "—"}</div>
              <div>Soreness {r.soreness ?? "—"}</div>
              <div>Sleep {r.sleep_hours ?? "—"}h</div>
              <div>Weight {r.weight_kg ?? "—"}kg</div>
            </div>
          ))}
        </div>
      </Layout>
    </RequireMember>
  );
}
