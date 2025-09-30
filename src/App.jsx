import { useEffect, useMemo, useState } from "react";
import "./App.css";
import msLogo from "./assets/mission-secure.svg";
import viteLogo from "/vite.svg"; // Vite’s built-in logo

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

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [view, setView] = useState("landing"); // landing | quiz | results
  const [aboutOpen, setAboutOpen] = useState(false);

  const [qs, setQs] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

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

  function choose(option) {
    const current = qs[idx];
    const nextAnswers = { ...answers, [current.id]: option };
    setAnswers(nextAnswers);
    if (idx + 1 < total) setIdx(idx + 1);
    else finish(nextAnswers);
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
      {/* faint background watermarks */}
      <div className="bg-logo" aria-hidden="true"></div>
      <div className="bg-vite" aria-hidden="true"></div>

      <Header
        theme={theme}
        setTheme={setTheme}
        onAbout={() => setAboutOpen(true)}
        onStart={start}
        msLogo={msLogo}
        viteLogo={viteLogo}
      />

      {view === "landing" && (
        <section className="wrap">
          <div className="hero-logos" aria-hidden="true">
            <img src={msLogo} className="hero-logo" alt="" />
            <span className="x">×</span>
            <img src={viteLogo} className="hero-logo vite" alt="" />
          </div>
          <h1 className="title">Quick Cyber Hygiene Check</h1>
          <p className="lead">10 questions, plain English. Get a percentage score and quick wins.</p>
          <div className="cta">
            <button className="btn btn--primary" onClick={start}>Take assessment</button>
            <button className="btn btn--ghost" onClick={() => setAboutOpen(true)}>About us</button>
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
              <button key={i} className="option" onClick={() => choose(opt)} aria-label={`Answer: ${opt.label}`}>
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
              <img src={msLogo} alt="" />
              <img src={viteLogo} className="report-vite" alt="" />
              <div>
                <h1>Cyber Hygiene Test — Report</h1>
                <p>by Mission Secure {new Date(result.dateISO).toLocaleString()}</p>
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

      {aboutOpen && <About modalClose={() => setAboutOpen(false)} viteLogo={viteLogo} msLogo={msLogo} />}

      {/* persistent corner badge */}
      <img className="corner-badge" src={msLogo} alt="Mission Secure" aria-hidden="true" />
    </div>
  );
}

/* ---------- UI Pieces ---------- */

function Header({ theme, setTheme, onAbout, onStart, msLogo, viteLogo }) {
  return (
    <header className="topbar">
      <div className="brand">
        <img src={msLogo} className="logo" alt="" aria-hidden="true" />
        <h2>
          Cyber Hygiene Test <span className="by">by Mission Secure</span>
          <span className="powered">
            <span className="dot">•</span> <img src={viteLogo} className="logo vite" alt="" aria-hidden="true" /> 
          </span>
        </h2>
      </div>

      <div className="top-actions">
        <button className="btn btn--ghost" onClick={onAbout}>About us</button>
        <button className="btn btn--primary" onClick={onStart}>Take assessment</button>

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

function About({ modalClose, viteLogo, msLogo }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="About Mission Secure">
      <div className="modal__card bubble">
        <div className="modal__head">
          <div className="about-brand">
            <img src={msLogo} alt="" aria-hidden="true" />
            <span className="x">×</span>
            <img src={viteLogo} className="vite" alt="" aria-hidden="true" />
            <h3>About Mission Secure</h3>
          </div>
          <button className="link" onClick={modalClose} aria-label="Close">✕</button>
        </div>
        <p>
          This quick self-check translates NIST SP 800-171 basics into
          plain English. Our mission: celebrate strengths, surface fast wins,
          and guide your next best step.
        </p>
        <ul className="about-list">
          <li>Simple questions anyone can answer</li>
          <li>Percent score with color gradient</li>
          <li>Private by default — runs in your browser</li>
        </ul>
        <div className="cta"><button className="btn btn--primary" onClick={modalClose}>Got it</button></div>
      </div>
    </div>
  );
}
