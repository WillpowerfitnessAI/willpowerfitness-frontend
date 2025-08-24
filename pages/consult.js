// pages/consult.js
import Footer from '../Footer'; // or '../components/Footer' if that's where you put it
import { useEffect, useRef, useState } from "react";

// --- simple rules -> personalized plan text (no keys needed) ---
function buildPlan(a) {
  const days = String(a.schedule || "").match(/\d+/)?.[0]
    ? parseInt(String(a.schedule).match(/\d+/)[0], 10) : 3;
  const exp = (a.experience || "").toLowerCase();
  const goal = (a.goal || "").toLowerCase();
  const prefs = (a.prefs || "").toLowerCase();
  const cts  = (a.constraints || "").toLowerCase();

  const fatLoss = /lose|fat|weight|cut/.test(goal);
  const muscle  = /muscle|build|gain|hypert/.test(goal);
  const strength= /strong|strength|pr|deadlift|squat|bench/.test(goal) || (!fatLoss && !muscle);

  const style = [];
  if (fatLoss) style.push("hybrid conditioning (intervals, sleds, carries)", "steps target (8–12k/day)");
  if (muscle)  style.push("hypertrophy blocks (moderate volume, 6–12 reps)", "tempo work + progressive overload");
  if (strength)style.push("periodized strength (heavy singles/doubles, top sets, back-off volume)");

  const tweaks = [];
  if (/knee/.test(cts))      tweaks.push("knee-friendly lower: box squat to parallel, RDLs, sled push/pull, cycling/rowing");
  if (/shoulder/.test(cts))  tweaks.push("shoulder-safe upper: landmine press, neutral-grip DB press/rows, cable work, avoid deep dips");

  let split;
  if (days <= 2)      split = "Upper / Lower + short conditioning";
  else if (days === 3) split = "Full-body x3 (strength focus Mon/Fri, pump/conditioning Wed)";
  else if (days === 4) split = "Upper / Lower / Upper / Lower";
  else                 split = "PPL (Push/Pull/Legs) + 1–2 conditioning days";

  const sample = [];
  if (days >= 3) {
    sample.push("Day 1 – Lower strength: Box squat 4×5, RDL 4×6, split squat 3×8, core; finisher: sled 6×30m");
    sample.push("Day 2 – Upper hypertrophy: Landmine press 4×8, chest-supported row 4×10, cable fly 3×12, curls 3×12");
    sample.push("Day 3 – Conditioning: 8–10 rounds 40s on/20s off (bike/rower/carries); mobility");
  }
  if (days >= 4) sample.push("Day 4 – Lower pump: Hack or goblet squat 3×10, hip hinge 3×10, ham curl 3×12, calves");
  if (days >= 5) sample.push("Day 5 – Upper strength: DB bench 5×5, weighted row 5×5, dips/push-ups, accessories");

  const tone = "Direct, disciplined, and on your side. We’ll push, not punish. Consistency beats hero workouts.";

  return {
    headline: `Based on your answers, here’s how I’d start you (${days}d/wk, ${exp || "baseline"} level):`,
    style: [...style, ...(tweaks.length ? ["—"] : []), ...tweaks],
    split,
    sample,
    nutrition: fatLoss
      ? "High-protein calorie deficit, 30–40g protein per meal, 8–12k steps/day, 2–3L water."
      : "High-protein maintenance/surplus, consistent meal timing, peri-workout carbs, 2–3L water.",
    tone,
    nudge: "Ready to execute? Trial if you want to test. Join if you’re all-in. Either way, I’ll hold you accountable."
  };
}

const questions = [
  { key:"name",        label:"What’s your name?", placeholder:"Willie", validate:v=>v.trim().length>=2 || "Please enter your name." },
  { key:"email",       label:"What’s your email for login + updates?", placeholder:"you@example.com",
    validate:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email." },
  { key:"goal",        label:"Primary goal in the next 12 weeks?", placeholder:"Lose 12 lbs, add 40 lb to squat, etc.", validate:v=>v.trim().length>=4 || "Tell me your goal." },
  { key:"schedule",    label:"How many days/week can you train?", placeholder:"e.g., 3–4 days, Mon/Wed/Fri", validate:v=>v.trim().length>=1 || "Add a rough schedule." },
  { key:"experience",  label:"Training experience level?", placeholder:"Beginner / Intermediate / Advanced", validate:v=>v.trim().length>=3 || "Add your experience level." },
  { key:"constraints", label:"Any injuries or constraints?", placeholder:"Right knee pain, limited equipment, travel", validate:v=>v.trim().length>=1 || "Add N/A if none." },
  { key:"prefs",       label:"Any preferences?", placeholder:"hates burpees, loves kettlebells, etc.", validate:()=>true },
];

export default function Consult() {
  const buyUrl   = process.env.NEXT_PUBLIC_STRIPE_BUY_URL;
  const trialUrl = process.env.NEXT_PUBLIC_STRIPE_TRIAL_URL;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role:"assistant", text:"Welcome—let’s build your plan. I’ll ask a few quick questions." }
  ]);
  const [plan, setPlan] = useState(null);
  const listRef = useRef(null);

  useEffect(()=>{ listRef.current?.scrollTo(0, listRef.current.scrollHeight); }, [messages]);

  useEffect(()=>{
    if (messages.length===1) setMessages(m=>[...m,{role:"assistant",text:questions[0].label}]);
  },[]);

  const currentQ = questions[step];

  function persistLeadMinimal(a){
    try {
      localStorage.setItem("lead_min", JSON.stringify({ name:a.name, email:a.email, ts:Date.now() }));
      // fire-and-forget minimal lead (name/email only)
      const body = new Blob([JSON.stringify({ name:a.name, email:a.email, source:"consult-exit" })],
                            { type: 'application/json' });
      navigator.sendBeacon?.("https://api.willpowerfitnessai.com/api/lead-min", body);
    } catch {}
  }

  async function sendFullIntake(intent){
    const body = { intent, answers, summary: plan };
    try {
      await fetch("https://api.willpowerfitnessai.com/api/lead", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(body),
        keepalive: true
      });
    } catch {}
  }

  const send = () => {
    if (!currentQ) return;
    const valid = currentQ.validate(input);
    if (valid !== true) { setMessages(m=>[...m,{role:"assistant",text:valid}]); return; }

    const nextAnswers = { ...answers, [currentQ.key]: input };
    setMessages(m=>[...m,{role:"user",text:input}]);
    setAnswers(nextAnswers);
    setInput("");

    const nextStep = step + 1;
    setStep(nextStep);

    if (nextStep < questions.length) {
      setMessages(m=>[...m,{role:"assistant",text:questions[nextStep].label}]);
    } else {
      const p = buildPlan(nextAnswers);
      setPlan(p);
      const summary =
        `Great. Summary:\n• Name: ${nextAnswers.name}\n• Email: ${nextAnswers.email}\n• Goal: ${nextAnswers.goal}\n` +
        `• Schedule: ${nextAnswers.schedule}\n• Experience: ${nextAnswers.experience}\n` +
        `• Constraints: ${nextAnswers.constraints}\n• Preferences: ${nextAnswers.prefs}`;
      setMessages(m=>[
        ...m,
        { role:"assistant", text: summary },
        { role:"assistant", text: p.headline },
        { role:"assistant", text: `Training focus: ${p.style.join("; ")}` },
        { role:"assistant", text: `Split: ${p.split}` },
        { role:"assistant", text: `Sample week:\n- ${p.sample.join("\n- ")}` },
        { role:"assistant", text: `Nutrition: ${p.nutrition}` },
        { role:"assistant", text: p.nudge }
      ]);
      persistLeadMinimal(nextAnswers); // keep only name/email if they bounce
    }
  };

  const disabledTrial = !trialUrl;
  const disabledBuy   = !buyUrl;

  return (
    <main style={{minHeight:"100vh",background:"#0a0a0a",color:"#fff",
                  display:"grid",placeItems:"center",padding:"2rem"}}>
      <section style={{width:"min(980px, 92vw)"}}>
        <h1 style={{fontSize:"2rem",marginBottom:"0.75rem"}}>Free Consultation</h1>
        <p style={{opacity:.8,margin:"0 0 1rem"}}>
          15–20 minutes of smart Q&A to align goals, schedule, and constraints. 100% autonomous coach.
        </p>

        {/* Chat window */}
        <div ref={listRef}
             style={{height:"50vh",minHeight:360,overflowY:"auto",background:"#0f0f0f",
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

        {/* Input */}
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

        {/* CTAs */}
        {step >= questions.length && (
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8}}>
            <a href="/brochure.pdf" download>
              <button style={{padding:"0.85rem 1rem",borderRadius:12,border:"1px solid #444",background:"#111",color:"#fff",cursor:"pointer"}}>
                Download Overview (PDF)
              </button>
            </a>

            <a href={trialUrl || "#"}
               onClick={(e)=>{ if(disabledTrial){ e.preventDefault(); alert("Trial link not configured."); return; }
                               sendFullIntake("trial"); }}>
              <button style={{padding:"0.85rem 1rem",borderRadius:12,border:"1px solid #1f1f1f",
                              background:"#1a1a1a",color:"#fff",cursor:"pointer",
                              opacity: disabledTrial ? .8 : 1}}>
                Start Trial
              </button>
            </a>

            <a href={buyUrl || "#"}
               onClick={(e)=>{ if(disabledBuy){ e.preventDefault(); alert("Join link not configured."); return; }
                               sendFullIntake("join"); }}>
              <button style={{padding:"0.85rem 1rem",borderRadius:12,border:"1px solid #fff",
                              background:"#fff",color:"#000",cursor:"pointer",
                              opacity: disabledBuy ? .8 : 1}}>
                Join Now
              </button>
            </a>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
