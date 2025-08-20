// pages/dashboard/index.js
import Layout from '../../components/Layout.jsx';
import RequireMember from '../../components/RequireMember.jsx';
import ChatBox from '../../components/ChatBox'; 

export default function Dashboard() {
  return (
    <RequireMember>
      <Layout title="Dashboard">
        <h1>Dashboard</h1>

        {/* Feature cards -> real routes */}
        <div className="grid gap-4" style={{ marginTop: 16 }}>
          <div className="card">
            <strong>Check-in</strong>
            <p className="muted">Log RPE, soreness, sleep. We'll auto-adjust.</p>
            <a className="btn btn-primary" href="/dashboard/checkin">Go to check-in</a>
          </div>

          <div className="card">
            <strong>Habits &amp; Progress</strong>
            <p className="muted">Track meals, steps, weight, photos.</p>
            <a className="btn btn-primary" href="/dashboard/progress">Open Progress</a>
          </div>
        </div>

        {/* Coach chat */}
        <section style={{ marginTop: 24 }}>
          <h2>Chat with coach/AI</h2>
          <ChatBox /> {/* Uppercase React component */}
        </section>
      </Layout>
    </RequireMember>
  );
}


