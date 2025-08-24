// pages/consult.js
import { useEffect, useRef, useState } from "react";

const questions = [
  { key: "name", label: "What’s your name?", placeholder: "Willie", validate: v => v.trim().length >= 2 || "Please enter your name." },
  { key: "email", label: "What’s your email for login + updates?", placeholder: "you@example.com",
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email." },
  { key: "goal", label: "Primary goal in the next 12 weeks?", placeholder: "Lose 12 lbs, add 40 lb to squat, etc.", validate: v => v.trim().length >= 4 || "Tell me your goal." },
  { key: "schedule", label: "How many days/week can you train?", placeholder: "e.g., 3–4 days, Mon/Wed/Fri", validate: v => v.trim().length >= 2 || "Add a rough schedule." },
  { key: "experience", label: "Training experience level?", placeholder: "Beginner / Intermediate / Advanced", validate: v => v.trim().length >= 3 || "Add your experience level." },
  { key: "constraints", label: "Any injuries or constraints?", placeholder: "Right knee pain, travel often, limited equipment", validate: v => v.trim().length >= 2 || "Add N/A if none." },
  { key: "prefs", label: "Any preferences?", placeholder: "Likes/Dislikes (e.g., hates burpees, loves kettlebells)", validate: () => true },
];

export default function Consult() {
  const buyUrl   = process.env.NEXT_PUBLIC_STRIPE_BUY_URL;
  const trialUrl = process.env.NEXT_PUBLIC_STRIPE_TRIAL_URL;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome—let’s build your plan. I’ll ask a few quick questions." },
  ]);
  const listRef = useRef(null);

  useEffect(() => { listRef.current?.scrollTo(0, listRef.current.scrollHeight); }, [messages]);

  const currentQ = questions[step];

  const send = () => {
    if (!currentQ) return;
    const valid = currentQ.validate(input);
    if (valid !== true) { setMessages(m => [...m, { role: "assistant", text: valid }]); return; }

    setMessages(m => [...m, { role: "user", text: input }]);
    const nextAnswers = { ...answers, [currentQ.key]: input };
    setAnswers(nextAnswers);
    setInput("");

    const nextStep = step + 1;
    setStep(nextStep);

    if (nextStep < questions.length) {
      const nextQ = questions[nextStep];
      setMessages(m => [...m, { role: "assistant", text: nextQ.label }]);
    } else {
      // Summary & CTAs
      const summary =
        `Great. Summary:\n• Name: ${nextAnswers.name}\n• Email: ${nextAnswers.email}\n• Goal: ${nextAnswers.goal}\n` +
        `• Schedule: ${nextAnswers.schedule}\n• Experience: ${nextAnswers.experience}\n` +
        `• Constraints: ${nextAnswers.constraints}\n• Preferences: ${nextAnswers.prefs}\n\n` +
        `You can start a trial, join now, or download the overview.`;
      setMessages(m => [...m, { role: "assistant", text: summary }]);
    }
  };

  useEffect(() => {
    // Kick off the first question after greeting
    if (messages.length === 1 && currentQ) {
      setMessages(m => [...m, { role: "assistant", text: currentQ.label }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disabledTrial = !trialUrl;
  const disabledBuy = !buyUrl;

  return (
    <main style={{minHeight:"100vh",background:"#0a0a0a",color:"#fff",display:"grid",placeItems:"center",padding:"2rem"}}>
      <section style={{width:"min(920px, 92vw)"}}>
        <h1 style={{fontSize:"2rem",marginBottom:"0.75rem"}}>Free Consultation</h1>
        <p style={{opacity:.8,margin:"0 0 1rem"}}>
          15–20 minutes of smart Q&A to align goals, schedule, and constraints. 100% autonomous coach—no phone calls.
        </p>

        {/* Chat window */}
        <div ref={listRef}
             style={{height:"48vh",minHeight:360,overflowY:"auto",background:"#0f0f0f",
                     border:"1px solid #222",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",margin:"6px 0"}}>
              <div style={{
                maxWidth:"78%", padding:"10px 12px", borderRadius:12, lineHeight:1.35,
                background: m.role==="user" ? "#fff" : "#151515",
                color: m.role==="user" ? "#000" : "#fff",
                border: m.role==="user" ? "1px solid #eaeaea" : "1px solid #222"
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input row */}
        {step < questions.length && (
          <form onSubmit={(e)=>{e.preventDefault(); send();}}
                style={{display:"flex",gap:10,alignItems:"center",marginBottom:18}}>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              placeholder={currentQ?.placeholder || "Type here"}
              style={{flex:1,padding:"0.9rem 1rem",borderRadius:12,border:"1px solid #333",background:"#111",color:"#fff"}}
            />
            <button type="submit"
              style={{padding:"0.9rem 1.1rem",borderRadius:12,border:"1px solid #fff",background:"#fff",color:"#000",cursor:"pointer"}}>
              Send
            </button>
          </form>
        )}

        {/* Final CTAs show once all questions answered */}
        {step >= questions.length && (
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8}}>
            <a href="/brochure.pdf" download>
              <button style={{padding:"0.85rem 1rem",borderRadius:12,border:"1px solid #444",background:"#111",color:"#fff",cursor:"pointer"}}>
                Download Overview (PDF)
              </button>
            </a>

            <a href={trialUrl || "#"} aria-disabled={disabledTrial}
               onClick={e=>{ if(disabledTrial){ e.preventDefault(); alert("Trial link not configured."); }}}
            >
              <button style={{padding:"0.85rem 1rem",borderRadius:12,border:"1px solid #1f1f1f",
                              background:"#1a1a1a",color:"#fff",cursor:"pointer",opacity:disabledTrial?.8:1}}>
                Start Trial
              </button>
            </a>

            <a href={buyUrl || "#"} aria-disabled={disabledBuy}
               onClick={e=>{ if(disabledBuy){ e.preventDefault(); alert("Join link not configured."); }}}
            >
              <button style={{padding:"0.85rem 1rem",borderRadius:12,border:"1px solid #fff",background:"#fff",color:"#000",cursor:"pointer",opacity:disabledBuy?.8:1}}>
                Join Now
              </button>
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
