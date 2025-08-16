// pages/dashboard/index.js
import Layout from '../../components/Layout';

export default function Dashboard(){
  return (
    <Layout>
      <h1>Dashboard</h1>
      <div className="grid grid-2" style={{marginTop:16}}>
        <div className="card">
          <strong>Today’s Plan</strong>
          <p className="muted">Your personalized session here (coming next).</p>
        </div>
        <div className="card">
          <strong>Check-in</strong>
          <p className="muted">Log RPE, soreness, sleep. We’ll auto-adjust.</p>
        </div>
        <div className="card">
          <strong>Chat with Coach</strong>
          <p className="muted">24/7 AI coaching. (Hook up Groq/OpenAI next.)</p>
        </div>
        <div className="card">
          <strong>Habits & Progress</strong>
          <p className="muted">Track meals, steps, weight, photos.</p>
        </div>
      </div>
    </Layout>
  );
}
