// pages/subscribe.js
import Layout from '../components/Layout.jsx';

export default function Subscribe() {
  return (
    <Layout title="Subscribe">
      <main style={{ padding: 24 }}>
        <h1>Subscribe</h1>
        <p>Join WillpowerFitness AI to unlock coaching, custom plans, and progress tracking.</p>

        {/* Paid flow (no trial) → pre-checkout form */}
        <a className="btn btn-primary" href="/join">Continue</a>
      </main>
    </Layout>
  );
}
