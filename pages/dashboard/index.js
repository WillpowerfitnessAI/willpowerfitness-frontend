// pages/dashboard/index.js
import Layout from '../../components/Layout.jsx';
import RequireMember from '../../components/RequireMember.jsx';
import ChatBox from '../../components/ChatBox';

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
      {/* Hide the top-right nav on app pages */}
      <Layout title="Dashboard" showNav={false}>
        <h1>Dashboard</h1>

        {/* Feature cards -> real routes */}
        <div className="grid">
          <div className="card">
            <strong>Check-in</strong>
            <p className="muted">Log RPE, soreness, sleep. We'll auto-adjust.</p>
            <a className="btn btn-primary btn--sm" href="/dashboard/checkin">Go to check-in</a>
          </div>

          <div className="card">
            <strong>Habits &amp; Progress</strong>
            <p className="muted">Track meals, steps, weight, photos.</p>
            <a className="btn btn-primary btn--sm" href="/dashboard/progress">Open Progress</a>
          </div>
        </div>

        {/* Coach chat */}
        <section className="chat-section">
          <h2>Chat with coach/AI</h2>

          {/* Add a wrapper we can use to nudge the input size without touching the component code */}
          <div className="chat-wrapper">
            <ChatBox onSend={sendMessage} apiBase={API_BASE} />
          </div>
        </section>
      </Layout>

      <style jsx>{`
        h1 { margin-bottom: 8px; }

        .grid {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr;
          margin-top: 12px;
        }
        @media (min-width: 780px) {
          .grid { grid-template-columns: repeat(2, 1fr); }
        }

        .card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 14px;             /* tighter than default */
        }
        .card .muted { opacity: .75; margin: 4px 0 10px; }

        .btn {
          display: inline-block;
          text-decoration: none;
          border-radius: 10px;
        }
        .btn-primary { background: #fff; color: #000; border: 1px solid #fff; }
        .btn--sm { padding: 8px 12px; font-size: .95rem; }  /* smaller CTAs */

        .chat-section { margin-top: 18px; }

        /* Make the chat area a bit tighter and the input a bit taller */
        .chat-wrapper { margin-top: 10px; }
        /* Taller input; the selector is broad so it works regardless of ChatBox internals */
        .chat-wrapper :global(textarea) {
          min-height: 80px;          /* bigger typing area */
        }
        /* If your ChatBox has a scroll area container, cap it slightly to keep the section compact */
        .chat-wrapper :global(.chatbox-body),
        .chat-wrapper :global(.messages),
        .chat-wrapper :global([data-chat-body]) {
          max-height: 420px;
        }
      `}</style>
    </RequireMember>
  );
}
