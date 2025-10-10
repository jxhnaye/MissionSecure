import { useEffect, useMemo, useState } from "react";
import "./App.css";
import darkLogo from "./assets/mission-secureb.png";
import lightLogo from "./assets/mission-securew.png";
import benjaminPhoto from "./assets/team/benjamin.jpg.png";
import lailaPhoto from "./assets/team/laila.jpg.png";
import carolinePhoto from "./assets/team/caroline.jpg.png";
import raePhoto from "./assets/team/rae.jpg.png";
import { v4 as uuidv4 } from "uuid";

/** ========= Base 10 questions (best=1, iffy=0.5, bad=0) ========= */
const BASE_QUESTIONS = [
  { id: "q1", text: "Which password is strongest?", options: [
      { label: "Tennis12", weight: 0, tag: "bad" },
      { label: "C0rnbread!", weight: 0.5, tag: "iffy" },
      { label: "lamp-otter-train-37!", weight: 1, tag: "best" }
    ], noteBad: "Avoid short or common words—use long passphrases.", noteIffy: "Good start—make it longer (12+), add word separators." },
  { id: "q2", text: "Multi-Factor Authentication (MFA) use?", options: [
      { label: "Not enabled anywhere", weight: 0, tag: "bad" },
      { label: "Enabled only on email", weight: 0.5, tag: "iffy" },
      { label: "Enabled on email, admin, and cloud apps", weight: 1, tag: "best" }
    ], noteBad: "Turn on MFA for email and all admin/cloud logins.", noteIffy: "Add MFA to admin portals and cloud apps too." },
  { id: "q3", text: "Password policy?", options: [
      { label: "No policy", weight: 0, tag: "bad" },
      { label: "Recommended 12+ but not enforced", weight: 0.5, tag: "iffy" },
      { label: "Enforced 12+ and password manager allowed", weight: 1, tag: "best" }
    ], noteBad: "Publish a simple 12+ character/passphrase policy.", noteIffy: "Enforce the policy in your identity provider." },
  { id: "q4", text: "Access to sensitive data is…", options: [
      { label: "Broad—many people can see it", weight: 0, tag: "bad" },
      { label: "Manual approvals, no scheduled reviews", weight: 0.5, tag: "iffy" },
      { label: "Least-privilege roles + quarterly reviews", weight: 1, tag: "best" }
    ], noteBad: "Limit by role; remove unused access.", noteIffy: "Add scheduled access reviews." },
  { id: "q5", text: "Privacy & data policy?", options: [
      { label: "None", weight: 0, tag: "bad" },
      { label: "Draft exists", weight: 0.5, tag: "iffy" },
      { label: "Written, shared with staff/customers", weight: 1, tag: "best" }
    ], noteBad: "Write a simple privacy policy (collect, store, share).", noteIffy: "Publish the policy and train staff." },
  { id: "q6", text: "Incident response plan?", options: [
      { label: "No plan", weight: 0, tag: "bad" },
      { label: "Contact list only", weight: 0.5, tag: "iffy" },
      { label: "Written plan + run drills", weight: 1, tag: "best" }
    ], noteBad: "Create a 1-page plan with steps and contacts.", noteIffy: "Practice a short tabletop drill." },
  { id: "q7", text: "Backups / continuity?", options: [
      { label: "No backups", weight: 0, tag: "bad" },
      { label: "Backups exist but never tested", weight: 0.5, tag: "iffy" },
      { label: "Automated daily + restore tested", weight: 1, tag: "best" }
    ], noteBad: "Set automated backups; keep one offsite.", noteIffy: "Test a restore to verify it works." },
  { id: "q8", text: "Device security?", options: [
      { label: "No AV or updates", weight: 0, tag: "bad" },
      { label: "AV installed; updates are manual", weight: 0.5, tag: "iffy" },
      { label: "EDR/AV + auto-updates + disk encryption", weight: 1, tag: "best" }
    ], noteBad: "Install reputable AV/EDR and enable auto-updates.", noteIffy: "Turn on automatic OS/app updates and encryption." },
  { id: "q9", text: "Physical security (if you have an office)?", options: [
      { label: "Open access", weight: 0, tag: "bad" },
      { label: "Locked room, no logs", weight: 0.5, tag: "iffy" },
      { label: "Controlled access and access logs", weight: 1, tag: "best" }
    ], noteBad: "Restrict server/network rooms; lock and label.", noteIffy: "Add a simple access log or badge audit." },
  { id: "q10", text: "Employee security training?", options: [
      { label: "No training", weight: 0, tag: "bad" },
      { label: "Annual reminders only", weight: 0.5, tag: "iffy" },
      { label: "Annual training + phishing drills", weight: 1, tag: "best" }
    ], noteBad: "Run a short yearly training on phishing & data.", noteIffy: "Add quick phishing simulations." }
];

/* ---------- utils ---------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ----- Cascading confetti: full fall, overlay everything ----- */
function confettiCascade(totalMs = 5000, batch = 28, everyMs = 110) {
  const container = document.createElement("div");
  container.className = "confetti";
  container.style.zIndex = "2147483647"; // over everything
  document.body.appendChild(container);

  const MIN_DUR = 3.8, MAX_DUR = 6.2, MAX_DELAY = 0.9;

  const makePiece = () => {
    const el = document.createElement("i");
    const w = 6 + Math.random() * 8;
    const h = 8 + Math.random() * 12;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.left = Math.random() * 100 + "vw";
    el.style.opacity = (0.85 + Math.random() * 0.15).toFixed(2);
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    const dur = (MIN_DUR + Math.random() * (MAX_DUR - MIN_DUR)).toFixed(2);
    const delay = (Math.random() * MAX_DELAY).toFixed(2);
    const sway = (1.2 + Math.random() * 1.1).toFixed(2);
    el.style.setProperty("--dur", `${dur}s`);
    el.style.setProperty("--sway", `${sway}s`);
    el.style.animationDelay = `${delay}s`;
    el.style.setProperty("--rot", Math.round(Math.random() * 360) + "deg");
    el.style.setProperty("--sx", Math.round(Math.random() * 60 - 30) + "px");
    el.addEventListener("animationend", () => el.remove());
    container.appendChild(el);
  };

  const interval = setInterval(() => { for (let i = 0; i < batch; i++) makePiece(); }, everyMs);
  setTimeout(() => {
    clearInterval(interval);
    const extra = (MAX_DELAY + MAX_DUR) * 1000 + 400;
    setTimeout(() => container.remove(), extra);
  }, totalMs);
}

/** Map 0..100 → hue 0..120 (red→green) */
const pctToHue = (p) => Math.round((Math.max(0, Math.min(100, p)) / 100) * 120);

/** Backend call (uses your server.mjs which reads OPENAI_API_KEY from .env) */
async function gradeWithAI(answers, percent, localNotes) {
  try {
    const res = await fetch("http://localhost:3001/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, localScore: percent, localNotes })
    });
    return await res.json();
  } catch {
    return { score: percent, notes: localNotes };
  }
}

// Identify this quiz version and the browser session (anonymous)
const QUIZ_ID = "mission-secure-v1";
function getSessionId() {
  const key = "ms_session_id";
  let sid = localStorage.getItem(key);
  if (!sid) {
    sid = uuidv4();
    localStorage.setItem(key, sid);
  }
  return sid;
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [view, setView] = useState("landing"); // landing | quiz | results
  const [whoWeAreOpen, setWhoWeAreOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [newsCache, setNewsCache] = useState(null);
  const [prefetching, setPrefetching] = useState(false);

  const [qs, setQs] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const total = qs?.length || BASE_QUESTIONS.length;
  const q = useMemo(() => (qs ? qs[idx] : BASE_QUESTIONS[0]), [qs, idx]);

  function start() {
    const randomized = shuffle(BASE_QUESTIONS).map(q => ({ ...q, options: shuffle(q.options) }));
    setQs(randomized);
    setAnswers({});
    setIdx(0);
    setView("quiz");
  }

  async function prefetchNews() {
    // avoid duplicate fetches; only fetch if we don't already have cached results
    if (newsCache || prefetching) return;
    const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
    if (!apiKey) return; // nothing to do without a key
    setPrefetching(true);
    try {
      const url = `https://newsapi.org/v2/everything?q=cybersecurity&language=en&sortBy=publishedAt&pageSize=8&apiKey=${apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNewsCache(data.articles || []);
      } else {
        setNewsCache([]);
      }
    } catch (e) {
      setNewsCache([]);
    } finally {
      setPrefetching(false);
    }
  }

  async function choose(option) {
    const current = qs[idx];
    const nextAnswers = { ...answers, [current.id]: option };
    setAnswers(nextAnswers);

    // Fire-and-forget logging so the UI advances immediately
    (async () => {
      try {
        const sessionId = getSessionId();
        await logResponse({
          sessionId,
          quizId: QUIZ_ID,
          questionId: current.id,
          optionLabel: option.label,
          optionTag: option.tag,
          weight: Number(option.weight ?? 0)
        });
      } catch (e) {
        // swallow network errors to avoid affecting UI
        console.error("Failed to log response:", e);
      }
    })();

    // advance UI immediately
    if (idx + 1 < total) setIdx(idx + 1);
    else finish(nextAnswers);
   
  }

  async function logResponse(data) {
  try {
    const res = await fetch("http://localhost:3001/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to log response:", err);
    } else {
      console.log("✅ Response logged successfully");
    }
  } catch (error) {
    console.error("❌ Error sending response to server:", error);
  }
}


  function localScoreAndNotes(ans) {
    const items = qs || BASE_QUESTIONS;
    const sum = items.reduce((acc, item) => acc + (ans[item.id]?.weight ?? 0), 0);
    const percent = Math.round((sum / items.length) * 100);
    const notes = [];
    items.forEach((item) => {
      const picked = ans[item.id];
      if (!picked) return;
      if (picked.weight === 0) notes.push(item.noteBad);
      else if (picked.weight === 0.5) notes.push(item.noteIffy);
    });
    return { percent, notes };
  }

  async function finish(finalAns) {
    const { percent, notes } = localScoreAndNotes(finalAns);
    const ai = await gradeWithAI(finalAns, percent, notes);
    const finalScore = Math.max(0, Math.min(100, Math.round(ai.score ?? percent)));
    const hue = pctToHue(finalScore);
    if (finalScore >= 85) confettiCascade();
    setResult({ score: finalScore, notes: ai.notes || notes, hue, dateISO: new Date().toISOString() });
    setView("results");
  }

  return (
    <div className="page">
      {/* faint background watermark (kept, non-vite) */}
      <div className="bg-logo" aria-hidden="true"></div>

      <Header
        theme={theme}
        setTheme={setTheme}
        onWhoWeAre={() => setWhoWeAreOpen(true)}
        onResources={() => setResourcesOpen(true)}
        onStart={start}
        onCyberNews={() => setNewsOpen(true)}
        onPrefetchNews={prefetchNews}
      />

      {view === "landing" && (
        <section className="wrap landing">
          <img src={theme === "light" ? lightLogo : darkLogo}
          alt="Mission Secure" className="landing-logo" />
          <h1 className="title">Quick Cyber Hygiene Check</h1>
          <p className="lead">10 questions, plain English. Get a percentage score and quick wins.</p>
          <div className="cta">
            <button className="btn btn--primary" onClick={start}>Take assessment</button>
          </div>
        </section>
      )}

      {view === "quiz" && qs && (
        <section className="wrap">
          <div className="quiz-head">
            <button className="link" onClick={() => setView("landing")}>← Back</button>
            <span className="progress">Question {idx + 1} / {total}</span>
          </div>
          <h2 className="q">{q.text}</h2>
          <div className="options">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className="option"
                onClick={() => {
                  if (transitioning) return;
                  setTransitioning(true);
                  choose(opt);
                  // small delay to prevent double clicks during state update
                  setTimeout(() => setTransitioning(false), 250);
                }}
                aria-label={`Answer: ${opt.label}`}
                disabled={transitioning}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {view === "results" && result && (
        <section id="report" className="wrap">
          {/* Print header */}
          <header className="print-only report-head">
            <div className="report-brand">
              <div>
                <h1>Cyber Hygiene Test — Report</h1>
                <p>by Mission Secure • {new Date(result.dateISO).toLocaleString()}</p>
              </div>
            </div>
          </header>

          {/* Screen header */}
          <h2 className="screen-only">Score</h2>

          <BigNumber value={result.score} hue={result.hue} />

          {result.notes?.length ? (
            <>
              <h3 className="mt">Suggestions</h3>
              <ul className="notes">
                {result.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </>
          ) : (
            <p className="lead">Nice work—minimal gaps detected.</p>
          )}

          <div className="cta screen-only">
            <button className="btn btn--primary" onClick={() => window.print()}>Download PDF</button>
            <button className="btn btn--ghost" onClick={() => setView("landing")}>Back to start</button>
          </div>
        </section>
      )}

      {whoWeAreOpen && <WhoWeAre modalClose={() => setWhoWeAreOpen(false)} />}
      {resourcesOpen && <Resources modalClose={() => setResourcesOpen(false)} />}
  {newsOpen && <CyberNews modalClose={() => setNewsOpen(false)} initialNews={newsCache} />}

      {/* optional persistent corner badge */}
      <img
        className="corner-badge"
        src={theme === "light" ? lightLogo : darkLogo}
        alt="Mission Secure"
        aria-hidden="true"
      />
    </div>
  );
}

/* ---------- UI Pieces ---------- */

function Header({ theme, setTheme, onWhoWeAre, onResources, onStart, onCyberNews, onPrefetchNews }) {
  return (
    <header className="topbar">
      <div className="brand">
        <img
          src={theme === "light" ? lightLogo : darkLogo}
          alt="Mission Secure"
          className="logo"
        />
        <h2>
          Cyber Hygiene Test <span className="by">by Mission Secure</span>
        </h2>
      </div>

      <div className="top-actions" style={{ display:'flex', gap:16, alignItems:'center' }}>
        <button
          className="btn btn--ghost"
          onClick={onCyberNews}
          onMouseEnter={onPrefetchNews}
          onFocus={onPrefetchNews}
        >
          <span role="img" aria-label="newspaper">📰</span> Latest Cyber News
        </button>
        <button className="btn btn--ghost" onClick={onWhoWeAre}>Who We Are</button>
        <button className="btn btn--primary" onClick={onStart}>Take assessment</button>
        <button className="btn btn--ghost" onClick={onResources}>Resources</button>
        <div className="theme-toggle" aria-label="Theme toggle">
          <input
            id="themeSwitch"
            type="checkbox"
            checked={theme === "light"}
            onChange={e => setTheme(e.target.checked ? "light" : "dark")}
          />
          <label htmlFor="themeSwitch" title="Light / Dark">
            <span className="sun">☀️</span>
            <span className="moon">🌙</span>
          </label>
        </div>
      </div>
    </header>
  );
}

function BigNumber({ value, hue }) {
  const color = `hsl(${hue} 85% 55%)`;
  return (
    <div className="score">
      <div className="score__num" style={{ color }}>{value}%</div>
      <div className="score__bar">
        <div
          className="score__fill"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, hsl(0 85% 55%), hsl(${hue} 85% 55%))`,
          }}
        />
      </div>
      <p className="score__legend">0 = red, 50 = orange, 70 = yellow, 85+ = green 🎉</p>
    </div>
  );
}
/* ---------- Team Data ---------- */
const TEAM = [
   {
    name: "Rae McElroy",
    role: "Advisor",
    school: "Founder, CyberSloth Security & Technology",
    degree: "Software Engineer; CyberAB Registered Practitioner (RP)",
    blurb: "Enjoys traveling, the arts, and believing in wild dreams.",
    import: raePhoto
    Linkedln: "https://www.linkedin.com/in/raefromhsj/";
  },
  {
    name: "Laila Velasquez",
    role: "Researcher",
    school: "California State University Los Angeles",
    degree: "B.S. Computer Science — May 2026",
    blurb: "Passionate about Data Science and I love matcha.",
    import: lailaPhoto
    Linkedln: "";
  },
  {
    name: "Aaliyah Crawford",
    role: "Researcher",
    school: "Langston University",
    degree: "B.S. Technology Engineering — 2024",
    blurb: "Fun fact: __________",
    import: aaliyahPhoto
    */---Linkedln "";----*/
  },
  {
    name: "Benjamin Maldonado",
    role: "Cybersecurity / Frontend",
    school: "California State University, Northridge",
    degree: "Computer Science / Computer Information Technology — May 2027",
    blurb: "Plays soccer for CSUN and loves traveling around California.",
    import: benjaminPhoto
    */---Linkedln "";----*/
  },
  {
    name: "Caroline De La Cruz",
    role: "Project Manager",
    school: "California State University, Northridge",
    degree: "Computer Information Technology — May 2027",
    blurb: "Enjoys reading and fun adventures.",
    import: carolinePhoto
    */---Linkedln "";----*/
  },
  {
    name: "Jonathan Gutierrez",
    role: "Database Developer",
    school: "California State University, Long Beach",
    degree: "Computer Science — May 2025",
    blurb: "Loves snowboarding, watching F1, and college football.",
    import: joanthanPhoto
    */---Linkedln "";----*/
  },
  {
    name: "Miles Ontiveros",
    role: "Backend Developer",
    school: "California State Polytechnic University, Pomona",
    degree: "Computer Information Systems — May 2027",
    blurb: "I love retro tech and thrifting.",
    import: milesPhoto
    */---Linkedln "";----*/
  },
  {
    name: "Janie Lozano",
    role: "Frontend / Researcher",
    school: "California State University, Dominguez Hills",
    degree: "B.S. Information Technology — May 2026",
    blurb: "I love drawing, painting and watching TV shows.",
    import: janiePhoto
    */---Linkedln "";----*/
  },
  {
    name: "John Aye",
    role: "Backend Developer / Researcher",
    school: "California State University, Dominguez Hills",
    degree: "B.S. Computer Science — Dec 2024",
    blurb: "Enjoys live music, snowboarding, and traveling.",
    import: johnPhoto
    */---Linkedln "";----*/
  },
];

/* ---------- Who We Are modal ---------- */
function WhoWeAre({ modalClose }) {
   const [showTeam, setShowTeam] = useState(false);

  const initials = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0,2).map(s=>s[0]).join("").toUpperCase();

    return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="whoWeAreTitle">
      <div className="modal__card bubble WhoWeAre-modal">
        <div className="modal__head">
          <div className="WhoWeAre-brand">
            <h3 id="whoWeAreTitle">Who We Are</h3>
          </div>
          <button className="link" onClick={modalClose} aria-label="Close Who We Are modal">✕</button>
        </div>
        
        <p>
          This quick self-check translates NIST SP 800-171 basics into
          plain English. Our mission: celebrate strengths, surface quick wins,
          and guide your next best step.
        </p>

        <ul className="WhoWeAre-list">
          <li>Simple questions anyone can answer</li>
          <li>Percent score with a helpful color gradient</li>
          <li>Private by default — runs in your browser</li>
        </ul>

        {/* actions */}
        <div className="cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn--primary" onClick={modalClose} autoFocus>Got it</button>
          <button
            className="btn btn--secondary"
            aria-expanded={showTeam}
            aria-controls="whoWeAreTeam"
            onClick={() => setShowTeam((v) => !v)}
          >
            {showTeam ? "Hide Team" : "Meet the Team"}
          </button>
        </div>

        {/* collapsible team area */}
        <div
          id="whoWeAreTeam"
          hidden={!showTeam}
          className="WhoWeAre-team"
          style={{
            marginTop: 16,
            paddingTop: 16,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        maxHeight: 340,            // keeps modal from growing too tall
        overflow: "auto",
        scrollbarWidth: "none",    // Firefox
        msOverflowStyle: "none",   // IE/Edge
       }}
      >
       <style>
        {`
          .WhoWeAre-team::-webkit-scrollbar {
           display: none;
          }
        `}
       </style>
       <div className="grid" style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))"
       }}>
        {TEAM.map((m) => (
          <article key={m.name}
           className="bubble"
           style={{
            border: "1px solid var(--border)",
            background: "var(--panel)",
            borderRadius: 16,
            padding: 12
           }}
          >
           <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "9999px",
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12,
              color: "var(--text)"
            }}>
              {initials(m.name)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, lineHeight: 1.1 }}>{m.name}</div>
              <div style={{ opacity: 0.7, fontSize: 12 }}>{m.role}</div>
            </div>
           </div>

           <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>
            <div>{m.school}</div>
            <div style={{ opacity: 0.7 }}>{m.degree}</div>
            <p style={{ marginTop: 6 }}>{m.blurb}</p>
           </div>

           {/* LinkedIn slot (enable later by adding m.linkedin) */}
           {/* {m.linkedin && (
            <a href={m.linkedin} target="_blank" rel="noreferrer"
              className="link" aria-label={`LinkedIn profile of ${m.name}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
               <path fill="currentColor" d="M6.94 7.5H3.56V20h3.38V7.5zM5.25 3.5a2 2 0 100 4 2 2 0 000-4zM20.44 20v-6.66c0-3.56-1.9-5.22-4.44-5.22-2.05 0-2.96 1.15-3.47 1.95v-1.67H9.19V20h3.34v-6.1c0-1.61.31-3.16 2.29-3.16 1.95 0 1.98 1.82 1.98 3.25V20h3.64z"/>
              </svg>
              LinkedIn
            </a>
           )} */}
          </article>
        ))}
       </div>
      </div>
    </div>
   </div>
  );
}
/* ---------- End of Who We Are modal ---------- */

/* ---------- Resources modal ---------- */
function Resources({ modalClose }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Resources">
      <div className="modal__card bubble resources-modal">
        <div className="modal__head">
          <div className="about-brand">
            <h3>Resources used to create quiz</h3>
          </div>
          <button className="link" onClick={modalClose} aria-label="Close">✕</button>
        </div>

        <h4>Primary References</h4>
        <ul className="about-list">
          <li>
            NIST SP 800-171 Rev. 3 — Protecting CUI:
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-171r3.pdf">PDF</a>
          </li>
          <li>
            NIST SP 800-171A — Assessment Procedures:
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-171A.pdf">PDF</a>
          </li>
          <li>
            Breaking Down NIST 800-171 Controls (overview):
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://sprinto.com/blog/list-of-nist-800-171-controls/">sprinto.com</a>
          </li>
        </ul>

        <h4 className="mt">Recommendations (quick wins)</h4>
        <ul className="about-list">
          <li><strong>Anti-virus / EDR:</strong> Bitdefender, Norton, Malwarebytes. Enable auto-updates and real-time protection.
            {" "}
            <a target="_blank" rel="noopener noreferrer" href="https://www.bitdefender.com/">Bitdefender</a> ·
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://us.norton.com/">Norton</a> ·
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://www.malwarebytes.com/">Malwarebytes</a>
          </li>
          <li><strong>MFA everywhere:</strong> Email, admin portals, and cloud apps (use an authenticator app or hardware key).</li>
          <li><strong>Passwords:</strong> Enforce 12+ character passphrases; allow a password manager (1Password, Bitwarden, LastPass).</li>
          <li><strong>Backups:</strong> Daily, automated, offsite; test a restore quarterly.</li>
          <li><strong>Access reviews:</strong> Least-privilege; remove unused accounts quarterly.</li>
          <li><strong>Incident plan:</strong> One-page IR plan + a short tabletop drill.</li>
          <li><strong>Training:</strong> Annual security training + periodic phishing drills.</li>
        </ul>

        <div className="cta">
          <button className="btn btn--primary" onClick={modalClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
/* ---------- Cyber News modal ---------- */
function CyberNews({ modalClose, initialNews = null }) {
  const [news, setNews] = useState(initialNews ?? []);
  const [loading, setLoading] = useState(initialNews ? false : true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have initialNews from prefetch, skip fetching
    if (initialNews) return;
    const controller = new AbortController();
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
        if (!apiKey) {
          setError('No NewsAPI key configured. Add VITE_NEWSAPI_KEY to your .env');
          setNews([]);
          return;
        }
        const url = `https://newsapi.org/v2/everything?q=cybersecurity&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        setNews(data.articles || []);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    return () => controller.abort();
  }, [initialNews]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Cyber news">
      <div className="modal__card bubble news-modal">
        <div className="modal__head">
          <div className="about-brand">
            <h3>Latest Cybersecurity News</h3>
          </div>
          <button className="link" onClick={modalClose} aria-label="Close">✕</button>
        </div>

        <div className="modal__body">
          {loading && <div style={{ padding: "1rem" }}>Loading news...</div>}
          {error && <div style={{ color: "red", padding: "1rem" }}>Error: {error}</div>}
          {!loading && !error && !news.length && <div style={{ padding: "1rem" }}>No recent articles found.</div>}

          {!loading && !error && news.length > 0 && (
            <ul className="about-list">
              {news.map((item) => (
                <li key={item.url || item.publishedAt}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
                  <div style={{ fontSize: "0.9em", color: "#a3a7b3" }}>
                    {item.source?.name || "Unknown source"} — {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : "Unknown date"}
                  </div>
                  <div>{item.description || ""}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cta">
          <button className="btn btn--primary" onClick={modalClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
/* ----End of Cyber News modal------ */
