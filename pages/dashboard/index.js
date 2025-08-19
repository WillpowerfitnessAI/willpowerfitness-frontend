// pages/dashboard/index.js
import Layout from '../../components/Layout';
import RequireMember from '../../components/RequireMember';

// NOTE the explicit extension so Next resolves the right file:
import ChatBox from '../../components/ChatBox.js';

export default function Dashboard() {
  return (
    <RequireMember>
      <Layout title="Dashboard">
        <h1>Dashboard</h1>

        {/* Feature cards → real routes */}
        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <div className="card">
            <strong>Check-in</strong>
            <p className="muted">Log RPE, soreness, sleep. We’ll auto-adjust.</p>
            <a className="btn btn--primary" href="/dashboard/checkin">
              Go to Check-in
            </a>
          </div>

          <div className="card">
            <strong>Habits &amp; Progress</strong>
            <p className="muted">Track meals, steps, weight, photos.</p>
            <a className="btn btn--primary" href="/dashboard/progress">
              Open Progress
            </a>
          </div>
        </div>

        {/* Coach chat */}
        <section style={{ marginTop: 24 }}>
          <h2>Chat with coach</h2>
          <ChatBox />
        </section>
      </Layout>
    </RequireMember>
  );
}

