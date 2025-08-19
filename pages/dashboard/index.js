// pages/dashboard/index.js
import Layout from '../../components/Layout';
import RequireMember from '../../components/RequireMember';
import ChatBox from '../../components/ChatBox';

export default function Dashboard() {
  return (
    <RequireMember>
      <Layout title="Dashboard">
        <h1>Coach</h1>
        <ChatBox />
      </Layout>
    </RequireMember>
  );
}
