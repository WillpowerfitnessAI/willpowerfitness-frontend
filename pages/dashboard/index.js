// pages/dashboard/index.js
import Layout from '../../components/Layout.jsx';
import RequireMember from '../../components/RequireMember.jsx';
import ChatBox from '../../components/ChatBox'; // folder import -> index.jsx

// Use the configured backend base URL (falls back to your API domain)
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://api.willpowerfitnessai.com').replace(/\/$/, '');

// This is what ChatBox will call to send a message.
// It always POSTS to the backend (not a Next.js local API route).
async function sendMessage(message, email) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, email }), // email optional
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Chat failed (${res.status})`);
  }

  const data = await res.json();
  return data.reply;
}

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
          {/* Pass the sender so ChatBox uses the backend URL and POST */}
          <ChatBox onSend={sendMessage} apiBase={API_BASE} />
        </section>
      </Layout>
    </RequireMember>
  );
}


