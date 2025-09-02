import ChatBox from "../components/ChatBox";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-4 text-2xl font-bold">Coach Chat</h1>
        <ChatBox />
      </div>
    </main>
  );
}
