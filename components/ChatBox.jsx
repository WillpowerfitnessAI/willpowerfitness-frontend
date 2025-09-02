// components/ChatBox.jsx
import { useEffect, useRef, useState } from "react";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome to WillpowerFitness AI. How can I help you today?" },
  ]);
  const listRef = useRef(null);

  // auto-scroll to newest message
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    // push user message
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");

    // mock assistant reply so UI feels alive (replace with real API later)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Got it. I’ll tailor your plan around that." },
      ]);
    }, 500);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-white/5 p-3 sm:h-[70vh] sm:p-4">
      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-teal-500 text-neutral-900"
                : "mr-auto bg-white/10 text-neutral-100"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Composer */}
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-neutral-900/70 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-xl bg-teal-500 px-5 py-3 font-semibold text-neutral-900 transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-teal-400"
        >
          Send
        </button>
      </form>
    </div>
  );
}
