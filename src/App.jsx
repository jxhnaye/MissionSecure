import { useEffect, useMemo, useState } from "react";
import "./App.css";
import darkLogo from "./assets/mission-secureb.png";
import lightLogo from "./assets/mission-securew.png";
import benjaminPhoto from "./assets/team/benjamin.jpg.png";
import lailaPhoto from "./assets/team/laila.jpg.png";
import carolinePhoto from "./assets/team/caroline.jpg.png";
import raePhoto from "./assets/team/rae.jpg.png";
import milesPhoto from "./assets/team/miles.jpg.jpg";
import johnPhoto from "./assets/team/john.jpg.png";
import jonathanPhoto from "./assets/team/jonathan.jpg.png";
import { v4 as uuidv4 } from "uuid";
import ContactUs from "./ContactUs";


/** ========= Base 10 questions (best=1, iffy=0.5, bad=0) ========= */
const BASE_QUESTIONS = [
  /** ========= Authentication & Access Control Question ========= */
  { id: "q1", text: "How does your organization secure user authentication? (Examples: Strong passwords, multi-factor authentication, password managers)", options: [
      { label: "Basic passwords only, no additional security measures", weight: 0, tag: "bad" },
      { label: "Strong password requirements OR multi-factor authentication (but not both)", weight: 0.5, tag: "iffy" },
      { label: "Both strong password policies AND multi-factor authentication enforced", weight: 1, tag: "best" }
    ], noteBad: "Implement both strong password requirements and multi-factor authentication.", noteIffy: "Great start! Add the missing piece - either MFA or stronger password policies." },
  /** ========= Access Control Question ========= */
  { id: "q2", text: "Does your company enforce procedures that limit access to sensitive data and systems to designated staff with appropriate clearance? (Examples: Role-based access, approval workflows)", options: [
      { label: "No, we don't have any such procedures", weight: 0, tag: "bad" },
      { label: "Some procedures exist but are not enforced", weight: 0.5, tag: "iffy" },
      { label: "Always enforced for all systems", weight: 1, tag: "best" }
    ], noteBad: "Implement access controls based on roles and responsibilities.", noteIffy: "Good start but consider enforcing it across all systems." },
  /** ========= Privacy and Data Protection Policy Question ========= */
  { id: "q3", text: "Does your organization maintain a written policy that outlines how personal and customer data is collected, used, shared, and protected?", options: [
      { label: "No policy exists", weight: 0, tag: "bad" },
      { label: "Draft exists but not enforced", weight: 0.5, tag: "iffy" },
      { label: "Written, shared with staff/customers, and regularly reviewed", weight: 1, tag: "best" }
    ], noteBad: "Create a privacy policy that covers data collection and usage.", noteIffy: "Add scheduled reviews of the policy." },
  /** ========= Incident Response Plan Question ========= */
  { id: "q4", text: "Does your organization have a documented plan detailing how it will respond to a cyberattack or data breach? (Examples: Containment procedures, notification protocols, recovery plans)", options: [
      { label: "No plan exists", weight: 0, tag: "bad" },
      { label: "Draft exists but not enforced", weight: 0.5, tag: "iffy" },
      { label: "Written, shared with staff/customers and they are trained regularly", weight: 1, tag: "best" }
    ], noteBad: "Write a simple incident response plan.", noteIffy: "Publish the plan and train staff." },
  /** ========= Business Continuity Plan Questions ========= */
  { id: "q5", text: "Does your organization have a strategy to maintain operations in the event of a cyber incident? (Examples: Remote work policies, data backups, failover systems)", options: [
      { label: "We are supposed to have one?", weight: 0, tag: "bad" },
      { label: "Kinda we have some stuff", weight: 0.5, tag: "iffy" },
      { label: "Yes we do have a plan and everyone is aware of it and trained on it", weight: 1, tag: "best" }
    ], noteBad: "Create a simple business continuity plan.", noteIffy: "Practice the plan with all staff." },
  /** ========= Device Security Question ========= */
  { id: "q6", text: "How well are your organization's devices (laptops, phones, tablets) secured and maintained? (Examples: Encryption, antivirus/EDR, automatic updates, remote wipe capability)", options: [
      { label: "Minimal security - basic antivirus only", weight: 0, tag: "bad" },
      { label: "Some security measures but inconsistently applied", weight: 0.5, tag: "iffy" },
      { label: "Comprehensive security: encryption, EDR/antivirus, auto-updates, and device management", weight: 1, tag: "best" }
    ], noteBad: "Implement device encryption, endpoint protection, and automatic updates.", noteIffy: "Ensure all security measures are consistently applied across all devices." },
  /** ========= Physical Security Question ========= */
  { id: "q7", text: "If your organization has an office space, are there safeguards to ensure only authorized personnel can access servers, network equipment, and/or sensitive files?", options: [
      { label: "No physical security measures in place", weight: 0, tag: "bad" },
      { label: "Basic measures like locked doors but no access tracking", weight: 0.5, tag: "iffy" },
      { label: "Comprehensive physical security with controlled access and logging", weight: 1, tag: "best" }
    ], noteBad: "Implement physical access controls for sensitive areas and equipment.", noteIffy: "Add access logging and regular security audits." },
  /** ========= Employee Training Question ========= */
  { id: "q8", text: "Do employees receive regular cybersecurity training (at least annually) on phishing, safe internet use, and handling sensitive information?", options: [
      { label: "No formal cybersecurity training provided", weight: 0, tag: "bad" },
      { label: "Occasional reminders or basic awareness materials", weight: 0.5, tag: "iffy" },
      { label: "Regular annual training plus ongoing phishing simulations and updates", weight: 1, tag: "best" }
    ], noteBad: "Implement annual cybersecurity training covering phishing, data handling, and safe practices.", noteIffy: "Add hands-on phishing simulations and regular security updates." },
  /** ========= Compliance Awareness Question ========= */
  { id: "q9", text: "Is your organization familiar with federal cybersecurity standards and frameworks? (Examples: NIST SP 800-171, CISA guidance, Department of Defense requirements)", options: [
      { label: "No awareness of federal cybersecurity standards", weight: 0, tag: "bad" },
      { label: "Some awareness but no formal compliance efforts", weight: 0.5, tag: "iffy" },
      { label: "Actively following and implementing relevant federal standards", weight: 1, tag: "best" }
    ], noteBad: "Research applicable federal cybersecurity standards for your industry and organization type.", noteIffy: "Develop a formal compliance plan and begin implementation of relevant standards." },
  /** ========= How are you feeling today Question ========= */
  { id: "q10", text: "How are you feeling today about your organization's cybersecurity posture?", options: [
      { label: "Very concerned - major gaps identified", weight: 0, tag: "bad" },
      { label: "Somewhat concerned - moderate gaps identified", weight: 0.5, tag: "iffy" },
      { label: "Feeling secure - no significant gaps identified", weight: 1, tag: "best" }
    ], noteBad: "Prioritize addressing major gaps in your cybersecurity posture.", noteIffy: "Continue monitoring and improving your cybersecurity measures." }
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
  const [view, setView] = useState("landing"); // landing | quiz | results | team
  const [WhoWeAreOpen, setWhoWeAreOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [cyberNewsOpen, setCyberNewsOpen] = useState(false);
  const [prefetchedNews, setPrefetchedNews] = useState(null);

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

  async function choose(option) {
    if (transitioning) return; // Prevent double-clicks
    
    setTransitioning(true);
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

    // Small delay to give visual feedback, then advance
    setTimeout(() => {
      if (idx + 1 < total) {
        setIdx(idx + 1);
      } else {
        finish(nextAnswers);
      }
      setTransitioning(false);
    }, 150); // Very short delay for visual feedback
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
    
    // Enhanced scoring with category weights and maturity bonuses
    const categoryWeights = {
      foundation: 1.2, // Authentication, backup, training
      advanced: 1.0,   // Device, physical, compliance  
      culture: 0.8     // Feeling, awareness
    };
    
    const categoryScores = {
      foundation: [],
      advanced: [],
      culture: []
    };
    
    // Categorize questions for weighted scoring
    items.forEach((item) => {
      const picked = ans[item.id];
      if (!picked) return;
      
      if (['q1', 'q3', 'q8'].includes(item.id)) {
        categoryScores.foundation.push(picked.weight);
      } else if (['q6', 'q7', 'q9'].includes(item.id)) {
        categoryScores.advanced.push(picked.weight);
      } else {
        categoryScores.culture.push(picked.weight);
      }
    });
    
    // Calculate weighted category averages
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(categoryScores).forEach(([category, scores]) => {
      if (scores.length > 0) {
        const categoryAvg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const weight = categoryWeights[category];
        totalScore += categoryAvg * weight * scores.length;
        totalWeight += weight * scores.length;
      }
    });
    
    let percent = Math.round((totalScore / totalWeight) * 100);
    
    // Maturity bonus: Extra points for comprehensive security approach
    const perfectAnswers = items.filter(item => ans[item.id]?.weight === 1).length;
    const maturityBonus = perfectAnswers >= 8 ? 5 : perfectAnswers >= 6 ? 3 : 0;
    percent = Math.min(100, percent + maturityBonus);
    
    // Generate dynamic, specific notes
    const notes = generateDynamicSuggestions(ans, items, categoryScores);
    
    return { percent, notes, categoryScores, maturityBonus };
  }
  
  function generateDynamicSuggestions(ans, items, categoryScores) {
    const suggestions = [];
    const criticalGaps = [];
    const improvements = [];
    
    // Enhanced risk assessment for each gap
    const riskMatrix = {
      'q1': { impact: 'HIGH', likelihood: 'HIGH', urgency: 1, cost: '$100-500' },
      'q2': { impact: 'MEDIUM', likelihood: 'HIGH', urgency: 2, cost: '$500-2000' },
      'q3': { impact: 'HIGH', likelihood: 'MEDIUM', urgency: 1, cost: '$200-1000' },
      'q4': { impact: 'MEDIUM', likelihood: 'MEDIUM', urgency: 3, cost: '$1000-5000' },
      'q5': { impact: 'HIGH', likelihood: 'LOW', urgency: 2, cost: '$2000-10000' },
      'q6': { impact: 'MEDIUM', likelihood: 'HIGH', urgency: 2, cost: '$500-3000' },
      'q7': { impact: 'MEDIUM', likelihood: 'LOW', urgency: 3, cost: '$1000-5000' },
      'q8': { impact: 'MEDIUM', likelihood: 'MEDIUM', urgency: 2, cost: '$2000-8000' },
      'q9': { impact: 'LOW', likelihood: 'LOW', urgency: 4, cost: '$5000-15000' }
    };
    
    // Analyze each answer for specific recommendations with risk context
    items.forEach((item) => {
      const picked = ans[item.id];
      if (!picked) return;
      
      const risk = riskMatrix[item.id] || { impact: 'MEDIUM', likelihood: 'MEDIUM', urgency: 3, cost: 'Variable' };
      
      if (picked.weight === 0) {
        const riskLevel = risk.impact === 'HIGH' && risk.likelihood === 'HIGH' ? 'CRITICAL' : 
                         risk.impact === 'HIGH' || risk.likelihood === 'HIGH' ? 'HIGH' : 'MEDIUM';
        criticalGaps.push({
          area: item.id,
          suggestion: `${item.noteBad} [${riskLevel} RISK • ${risk.cost} • 30-day target]`,
          priority: risk.urgency,
          riskLevel
        });
      } else if (picked.weight === 0.5) {
        improvements.push({
          area: item.id,
          suggestion: `${item.noteIffy} [MEDIUM RISK • ${risk.cost} • 60-day target]`,
          priority: risk.urgency + 2,
          riskLevel: 'MEDIUM'
        });
      }
    });
    
    // Sort by priority (urgency score)
    criticalGaps.sort((a, b) => a.priority - b.priority);
    improvements.sort((a, b) => a.priority - b.priority);
    
    // Add strategic recommendations based on patterns
    const foundationAvg = categoryScores.foundation.length > 0 ? 
      categoryScores.foundation.reduce((sum, score) => sum + score, 0) / categoryScores.foundation.length : 0;
    const advancedAvg = categoryScores.advanced.length > 0 ? 
      categoryScores.advanced.reduce((sum, score) => sum + score, 0) / categoryScores.advanced.length : 0;
    
    if (foundationAvg < 0.7) {
      suggestions.push("🎯 STRATEGIC PRIORITY: Focus on cybersecurity fundamentals first - authentication, backups, and training form your security foundation. [Est. 60-90 days, $2000-8000 total investment]");
    }
    
    if (advancedAvg > foundationAvg + 0.3) {
      suggestions.push("⚖️ BALANCE RECOMMENDATION: Your advanced security exceeds your fundamentals. Strengthen your foundation for better overall protection. [30-day rebalancing focus]");
    }
    
    // Add industry-specific insights with implementation guidance
    const hasCompliance = ans['q9']?.weight || 0;
    if (hasCompliance < 1) {
      suggestions.push("🏛️ COMPLIANCE ROADMAP: Consider NIST Cybersecurity Framework adoption. Start with 'Identify' and 'Protect' functions. [90-day implementation, consider compliance consultant $5000-15000]");
    }
    
    // Quick wins section
    const mfaStatus = ans['q1']?.weight || 0;
    if (mfaStatus < 1) {
      suggestions.push("🔐 IMMEDIATE ACTION (Week 1): Deploy Microsoft Authenticator company-wide. Free solution, 2-hour setup per user. [ROI: Prevents 99.9% of automated attacks]");
    }
    
    const backupStatus = ans['q3']?.weight || 0;
    if (backupStatus < 1) {
      suggestions.push("💾 30-DAY GOAL: Implement 3-2-1 backup strategy. Recommended: Veeam + AWS S3 Glacier ($50-200/month). [Business continuity insurance against ransomware]");
    }
    
    // Combine all suggestions in priority order with visual indicators
    const allSuggestions = [
      ...criticalGaps.map(g => `🚨 ${g.suggestion}`),
      ...improvements.map(i => `📈 ${i.suggestion}`),
      ...suggestions
    ];
    
    return allSuggestions.slice(0, 10); // Expanded to top 10 most important
  }

  async function finish(finalAns) {
    const { percent, notes, categoryScores, maturityBonus } = localScoreAndNotes(finalAns);
    const ai = await gradeWithAI(finalAns, percent, notes);
    const finalScore = Math.max(0, Math.min(100, Math.round(ai.score ?? percent)));
    const hue = pctToHue(finalScore);
    
    // Determine security maturity level
    let securityLevel = "Developing";
    let badge = "🥉";
    if (finalScore >= 95) {
      securityLevel = "Platinum - Cybersecurity Excellence";
      badge = "💎";
    } else if (finalScore >= 85) {
      securityLevel = "Gold - Advanced Security";
      badge = "🥇";
    } else if (finalScore >= 70) {
      securityLevel = "Silver - Good Security Practices";
      badge = "🥈";
    } else if (finalScore >= 50) {
      securityLevel = "Bronze - Basic Security Foundation";
      badge = "🥉";
    } else {
      securityLevel = "Developing - Needs Attention";
      badge = "🔧";
    }
    
    if (finalScore >= 85) confettiCascade();
    
    setResult({ 
      score: finalScore, 
      notes: ai.notes || notes, 
      hue, 
      dateISO: new Date().toISOString(),
      securityLevel,
      badge,
      categoryScores,
      maturityBonus
    });
    setView("results");
  }

  // Cyber news functions
  const onCyberNews = () => setCyberNewsOpen(true);
  
  const onPrefetchNews = async () => {
    if (prefetchedNews) return; // Already prefetched
    try {
      const apiKey = import.meta.env.NEWSAPI_KEY;
      if (!apiKey) return;
      const url = `https://newsapi.org/v2/everything?q=cybersecurity&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPrefetchedNews(data.articles || []);
      }
    } catch (e) {
      console.error("Failed to prefetch news:", e);
    }
  };

  return (
    <div className="page">
      {/* faint background watermark (kept, non-vite) */}
      <div className="bg-logo" aria-hidden="true"></div>

      <Header
        theme={theme}
        setTheme={setTheme}
        onWhoWeAre={() => setWhoWeAreOpen(true)}
        onResources={() => setResourcesOpen(true)}
        onCyberNews={onCyberNews}
        onPrefetchNews={onPrefetchNews}
        onStart={start}
      />

      {view === "landing" && (
        <section className="wrap landing">
          <img src={theme === "light" ? lightLogo : darkLogo}
          alt="Mission Secure" className="landing-logo" />
          <h1 className="title">Quick Cyber Hygiene Check</h1>
          <p className="lead">We are dedicated to helping you improve your cybersecurity posture. We provide a quick assessment to identify key areas for improvement.</p>
          <p className="lead">We are Mission Secure the cybersecurity team of LA Tech and we are here to help you.</p>
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
                onClick={() => choose(opt)} 
                aria-label={`Answer: ${opt.label}`}
                disabled={transitioning}
                style={{ 
                  opacity: transitioning ? 0.6 : 1,
                  cursor: transitioning ? 'not-allowed' : 'pointer'
                }}
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
          <h2 className="screen-only" style={{ color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>Security Assessment Results</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <BigNumber value={result.score} hue={result.hue} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>{result.badge}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: `hsl(${result.hue} 85% 55%)` }}>
                {result.securityLevel}
              </div>
              {result.maturityBonus > 0 && (
                <div style={{ fontSize: '14px', marginTop: '4px', color: '#4CAF50' }}>
                  +{result.maturityBonus} Maturity Bonus
                </div>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="executive-summary" style={{ 
            background: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: theme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.12)'
          }}>
            <h3 className="section-title" style={{ marginTop: 0, marginBottom: '16px', color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>📋 Executive Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div className="label-text" style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#a3a7b3' }}>Risk Level</div>
                <div className="value-text risk-level" style={{ fontSize: '18px', fontWeight: 'bold', color: result.score >= 85 ? '#4CAF50' : result.score >= 70 ? '#FF9800' : '#F44336' }}>
                  {result.score >= 85 ? 'Low Risk' : result.score >= 70 ? 'Moderate Risk' : 'High Risk'}
                </div>
              </div>
              <div>
                <div className="label-text" style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#a3a7b3' }}>Critical Issues</div>
                <div className="value-text" style={{ fontSize: '18px', fontWeight: 'bold', color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>
                  {result.notes?.filter(n => n.includes('🚨')).length || 0}
                </div>
              </div>
              <div>
                <div className="label-text" style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#a3a7b3' }}>Est. Implementation</div>
                <div className="value-text" style={{ fontSize: '18px', fontWeight: 'bold', color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>
                  {result.score >= 85 ? '30 days' : result.score >= 70 ? '60 days' : '90 days'}
                </div>
              </div>
              <div>
                <div className="label-text" style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#a3a7b3' }}>Investment Range</div>
                <div className="value-text" style={{ fontSize: '18px', fontWeight: 'bold', color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>
                  {result.score >= 85 ? '$500-2K' : result.score >= 70 ? '$2K-8K' : '$8K-20K'}
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown Visualization */}
          <div className="category-breakdown" style={{ 
            background: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: theme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.12)'
          }}>
            <h3 className="section-title" style={{ marginTop: 0, marginBottom: '20px', color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>📊 Security Category Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {result.categoryScores && Object.entries({
                'Foundation Security': { scores: result.categoryScores.foundation, color: '#4CAF50', icon: '🛡️' },
                'Advanced Controls': { scores: result.categoryScores.advanced, color: '#2196F3', icon: '⚡' },
                'Security Culture': { scores: result.categoryScores.culture, color: '#FF9800', icon: '👥' }
              }).map(([category, data]) => {
                const avg = data.scores.length > 0 ? 
                  Math.round((data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length) * 100) : 0;
                return (
                  <div key={category} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{data.icon}</div>
                    <div className="label-text" style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#a3a7b3', marginBottom: '8px' }}>
                      {category}
                    </div>
                    <div className="category-progress" style={{ 
                      width: '100%', 
                      height: '8px', 
                      background: theme === 'light' ? '#e0e0e0' : '#333',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <div className="category-progress-fill" style={{
                        width: `${avg}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${data.color}AA, ${data.color})`,
                        borderRadius: '4px',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>
                    <div className="value-text" style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      color: data.color
                    }}>
                      {avg}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Industry Benchmarking */}
          <div className="industry-comparison" style={{ 
            background: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: theme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.12)'
          }}>
            <h3 className="section-title" style={{ marginTop: 0, marginBottom: '16px', color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>📊 Industry Comparison</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div className="label-text" style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#a3a7b3' }}>Your Score</div>
                <div className="value-text" style={{ fontSize: '24px', fontWeight: 'bold', color: `hsl(${result.hue} 85% 55%)` }}>
                  {result.score}%
                </div>
              </div>
              <div>
                <div className="label-text" style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#a3a7b3' }}>Industry Average</div>
                <div className="value-text" style={{ fontSize: '24px', fontWeight: 'bold', color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>67%</div>
              </div>
              <div>
                <div className="label-text" style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#a3a7b3' }}>Top 10% Threshold</div>
                <div className="value-text" style={{ fontSize: '24px', fontWeight: 'bold', color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>85%</div>
              </div>
              <div>
                <div className="label-text" style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#a3a7b3' }}>Your Ranking</div>
                <div className="value-text" style={{ fontSize: '24px', fontWeight: 'bold', color: result.score >= 85 ? '#4CAF50' : result.score >= 67 ? '#FF9800' : '#F44336' }}>
                  {result.score >= 85 ? 'Top 10%' : result.score >= 67 ? 'Above Average' : 'Below Average'}
                </div>
              </div>
            </div>
          </div>

          {result.notes?.length ? (
            <>
              <h3 className="section-title mt" style={{ color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>🎯 Prioritized Action Plan</h3>
              <div className="action-plan" style={{ 
                background: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', 
                padding: '20px', 
                borderRadius: '8px', 
                border: theme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.12)'
              }}>
                <ul className="notes" style={{ margin: 0, paddingLeft: '20px' }}>
                  {result.notes.map((n, i) => (
                    <li key={i} className="action-item" style={{ 
                      marginBottom: '12px', 
                      lineHeight: '1.5',
                      fontWeight: '500',
                      color: n.includes('🚨') ? '#F44336' : n.includes('📈') ? '#FF9800' : (theme === 'light' ? '#17181c' : '#e9e9ef')
                    }}>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ 
                marginTop: '20px', 
                marginBottom: '24px',
                padding: '16px', 
                background: theme === 'light' ? 'rgba(124, 92, 255, 0.1)' : 'rgba(124, 92, 255, 0.15)', 
                borderRadius: '8px',
                border: theme === 'light' ? '1px solid rgba(124, 92, 255, 0.2)' : '1px solid rgba(124, 92, 255, 0.3)'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: theme === 'light' ? '#7c5cff' : '#6a8dff' }}>💡 Next Steps</h4>
                <p style={{ margin: 0, fontSize: '14px', color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>
                  Focus on addressing HIGH priority items first. Each improvement will significantly boost your security posture. 
                  Consider scheduling a follow-up assessment in 30-60 days to track your progress.
                </p>
              </div>
            </>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              background: theme === 'light' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.15)', 
              borderRadius: '8px',
              border: theme === 'light' ? '1px solid rgba(76, 175, 80, 0.2)' : '1px solid rgba(76, 175, 80, 0.3)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ color: theme === 'light' ? '#2E7D32' : '#4CAF50', marginBottom: '8px' }}>Outstanding Security Posture!</h3>
              <p style={{ color: theme === 'light' ? '#17181c' : '#e9e9ef', marginBottom: 0 }}>
                Your organization demonstrates excellent cybersecurity practices with minimal gaps detected.
                Continue monitoring and stay updated with emerging threats and best practices.
              </p>
            </div>
          )}

          <div className="cta screen-only" style={{ marginTop: '32px' }}>
            <button 
              className="btn btn--primary" 
              onClick={() => window.print()}
              style={{ marginRight: '16px' }}
            >
              Download Report PDF
            </button>
            <button className="btn btn--ghost" onClick={() => setView("landing")}>Take Assessment Again</button>
          </div>
        </section>
      )}

      {view === "team" && <TeamPage onBack={() => setView("landing")} theme={theme} />}

      {WhoWeAreOpen && <WhoWeAre modalClose={() => setWhoWeAreOpen(false)} setView={setView} />}
      {resourcesOpen && <Resources modalClose={() => setResourcesOpen(false)} />}
      {cyberNewsOpen && <CyberNews modalClose={() => setCyberNewsOpen(false)} initialNews={prefetchedNews} />}

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

function Header({ theme, setTheme, onWhoWeAre, onResources, onCyberNews, onPrefetchNews, onStart }) {
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
      <ContactUs />
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
    blurb: "I enjoy traveling, the arts, and believing in wild dreams.",
    photo: raePhoto,
    linkedin: "https://www.linkedin.com/in/raefromhsj/",
    emoji: "✈️",
  },
  {
    name: "Laila Velasquez",
    role: "Researcher",
    school: "California State University Los Angeles",
    degree: "B.S. Computer Science — May 2026",
    blurb: "I am very passionate about Data Science and I love matcha.",
    photo: lailaPhoto,
    linkedin: "https://www.linkedin.com/in/lailavelasquez/",
    emoji: "🍵",
  },
  {
    name: "Aaliyah Crawford",
    role: "Researcher",
    school: "Langston University",
    degree: "B.S. Technology Engineering — 2024",
    blurb: "Fun fact: __________",
    linkedin: "https://www.linkedin.com/in/aaliyah-crawford-393b71253/",
    emoji: "🌟",
  },
  {
    name: "Benjamin Maldonado",
    role: "Cybersecurity / Frontend",
    school: "California State University, Northridge",
    degree: "Computer Science / Computer Information Technology — May 2027",
    blurb: "I play soccer for CSUN and love traveling around California.",
    photo: benjaminPhoto,
    linkedin: "https://www.linkedin.com/in/benjamin-maldonado-043447269/",
    emoji: "⚽",
  },
  {
    name: "Caroline De La Cruz",
    role: "Project Manager",
    school: "California State University, Northridge",
    degree: "Computer Information Technology — May 2027",
    blurb: "I enjoy reading and fun adventures.",
    photo: carolinePhoto,
    linkedin: "https://www.linkedin.com/in/caroline-de-la-cruz-3b1a942a2/",
    emoji: "📚",
  },
  {
    name: "Jonathan Gutierrez",
    role: "Database Developer",
    school: "California State University, Long Beach",
    degree: "Computer Science — May 2025",
    blurb: "I love snowboarding, watching F1, and college football.",
    linkedin: "https://www.linkedin.com/in/jonathan-gutierrez-134433233/",
    photo: jonathanPhoto,
    emoji: "🏎️",
  },
  {
    name: "Miles Ontiveros",
    role: "Backend Developer",
    school: "California State Polytechnic University, Pomona",
    degree: "Computer Information Systems — May 2027",
    blurb: "I love collecting retro tech and thrifting.",
    photo: milesPhoto,
    linkedin: "https://www.linkedin.com/in/milesontiveros004/",
    emoji: "🕹️",
  },
  {
    name: "Janie Lozano",
    role: "Frontend / Researcher",
    school: "California State University, Dominguez Hills",
    degree: "B.S. Information Technology — May 2026",
    blurb: "I love drawing, painting and watching TV shows.",
    linkedin: "https://www.linkedin.com/in/janie-lozano-lozanojanie/",
    emoji: "🎨",
  },
  {
    name: "John Aye",
    role: "Backend Developer / Researcher",
    school: "California State University, Dominguez Hills",
    degree: "B.S. Computer Science — Dec 2024",
    blurb: "I enjoy live music, snowboarding, and traveling.",
    linkedin: "https://www.linkedin.com/in/jxhnaye/",
    photo: johnPhoto,
    emoji: "🎵",
  },
];

/* ---------- Who We Are modal ---------- */
function WhoWeAre({ modalClose, setView }) {
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
          This comprehensive cybersecurity assessment translates complex NIST SP 800-171 standards into 
          accessible, actionable insights for organizations of all sizes.
        </p>
        
        <p>
          <strong>Our Mission:</strong> To democratize cybersecurity knowledge by providing an intuitive, 
          research-backed assessment platform that evaluates your organization's security posture and 
          delivers personalized improvement roadmaps.
        </p>

        <p>
          Our platform features real-time cybersecurity news integration, sophisticated risk-based scoring 
          algorithms, and comprehensive reporting capabilities all designed to help you strengthen your 
          digital defenses and maintain regulatory compliance.
        </p>

        <ul className="WhoWeAre-list">
          <li>Evidence based assessment methodology derived from industry standards</li>
          <li>Advanced scoring with risk prioritization and implementation timelines</li>
          <li>Privacy first design with client-side processing and secure data handling</li>
          <li>Professional grade reports suitable for executive briefings and compliance documentation</li>
        </ul>

        {/* Disclaimer */}
        <div style={{ 
          marginTop: "1.5rem", 
          padding: "1rem", 
          background: "rgba(124, 92, 255, 0.1)", 
          borderRadius: "8px",
          border: "1px solid rgba(124, 92, 255, 0.2)"
        }}>
          <p style={{ 
            fontSize: "0.9rem", 
            margin: "0", 
            fontStyle: "italic",
            color: "var(--text)",
            opacity: "0.85"
          }}>
            <strong>Project Disclaimer:</strong> This cybersecurity assessment tool is an educational project 
            developed for LA Tech Org and is not intended for commercial sale or distribution. 
            It serves as a demonstration of cybersecurity best practices and modern web development techniques.
          </p>
        </div>

        {/* actions */}
        <div className="cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn--primary" onClick={modalClose} autoFocus>Got it</button>
          <button
            className="btn btn--secondary"
            onClick={() => {
              modalClose();
              setView("team");
            }}
          >
            Meet the Team
          </button>
        </div>
      </div>
    </div>
  );
}
/* ---------- End of Who We Are modal ---------- */

/* ---------- Team Page ---------- */
function TeamPage({ onBack, theme }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const initials = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0,2).map(s=>s[0]).join("").toUpperCase();

  return (
    <section className="wrap team-page">
      <div className="team-header">
        <button className="link" onClick={onBack} style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          ← Back to Home
        </button>
        <h1 style={{ 
          fontSize: "3rem", 
          fontWeight: "900", 
          margin: "0 0 0.5rem"
        }}>
          Our Team
        </h1>
        <p style={{ 
          color: "var(--muted)", 
          fontSize: "1.1rem", 
          margin: "0 0 2rem" 
        }}>
          Meet the talented individuals behind Mission Secure's Cyber Hygiene Test.
        </p>
      </div>

      <div className="team-grid" style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        marginTop: "2rem"
      }}>
        {TEAM.map((member) => (
          <article 
            key={member.name}
            className="team-card"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: "1.5rem",
              padding: "1.5rem",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Large emoji decoration on the right */}
            {member.emoji && (
              <div style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                fontSize: "4rem",
                opacity: "0.6",
                pointerEvents: "none",
                zIndex: 1
              }}>
                {member.emoji}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem", position: "relative", zIndex: 2 }}>
              <div 
                style={{
                  width: "4rem", 
                  height: "4rem", 
                  borderRadius: "50%",
                  background: member.photo ? "transparent" : "var(--bg-2)",
                  border: "2px solid var(--border)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  color: "var(--text)",
                  overflow: "hidden",
                  flexShrink: 0,
                  backgroundImage: member.photo ? `url(${member.photo})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  cursor: member.photo ? "pointer" : "default"
                }}
                onClick={() => member.photo && setSelectedPhoto(member)}
                title={member.photo ? "Click to view larger image" : ""}
              >
                {!member.photo && (member.emoji || initials(member.name))}
              </div>
              
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ 
                  margin: "0 0 0.25rem", 
                  fontSize: "1.3rem", 
                  fontWeight: "700"
                }}>
                  {member.name}
                </h3>
                <p style={{ 
                  margin: "0", 
                  color: "var(--muted)", 
                  fontSize: "0.95rem",
                  fontWeight: "600"
                }}>
                  {member.role}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "1rem", position: "relative", zIndex: 2 }}>
              <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                {member.school}
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                {member.degree}
              </div>
              <p style={{ 
                margin: "0", 
                fontSize: "0.95rem", 
                lineHeight: "1.5",
                color: "var(--text)",
                opacity: "0.9"
              }}>
                {member.blurb}
              </p>
            </div>

            {member.linkedin && (
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="link" 
                aria-label={`LinkedIn profile of ${member.name}`}
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.75rem",
                  background: "rgba(124, 92, 255, 0.1)",
                  border: "1px solid rgba(124, 92, 255, 0.2)",
                  transition: "all 0.2s ease",
                  position: "relative",
                  zIndex: 2
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(124, 92, 255, 0.15)";
                  e.target.style.borderColor = "rgba(124, 92, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(124, 92, 255, 0.1)";
                  e.target.style.borderColor = "rgba(124, 92, 255, 0.2)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path 
                    fill="currentColor" 
                    d="M6.94 7.5H3.56V20h3.38V7.5zM5.25 3.5a2 2 0 100 4 2 2 0 000-4zM20.44 20v-6.66c0-3.56-1.9-5.22-4.44-5.22-2.05 0-2.96 1.15-3.47 1.95v-1.67H9.19V20h3.34v-6.1c0-1.61.31-3.16 2.29-3.16 1.95 0 1.98 1.82 1.98 3.25V20h3.64z"
                  />
                </svg>
                LinkedIn
              </a>
            )}
          </article>
        ))}

        {/* Quote and Back to Home button - positioned next to John's card */}
        <div style={{
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: "1.5rem",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: "300px"
        }}>
          {/* Back to Home Button */}
          <button
            onClick={onBack}
            className="btn btn--primary"
            style={{
              fontSize: "1rem",
              padding: "0.8rem 1.2rem",
              marginBottom: "1.5rem"
            }}
          >
            ← Back to Home
          </button>

          {/* Quote */}
          <div style={{
            padding: "1.5rem",
            background: "rgba(124, 92, 255, 0.05)",
            border: "1px solid rgba(124, 92, 255, 0.1)",
            borderRadius: "1rem",
            maxWidth: "100%"
          }}>
            <blockquote style={{
              margin: "0",
              fontSize: "1rem",
              fontStyle: "italic",
              color: "var(--text)",
              opacity: "0.9",
              lineHeight: "1.5"
            }}>
              "Have you tried turning it off and on again?"
              <footer style={{
                marginTop: "0.75rem",
                fontSize: "0.9rem",
                color: "var(--muted)",
                fontStyle: "normal",
                fontWeight: "600"
              }}>
                — By everyone in the tech world
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="modal" 
          style={{ 
            position: "fixed", 
            inset: 0, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            background: "rgba(0, 0, 0, 0.8)", 
            zIndex: 1000,
            padding: "2rem"
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            style={{
              position: "relative",
              maxWidth: "500px",
              maxHeight: "600px",
              background: "var(--panel)",
              borderRadius: "1.5rem",
              overflow: "hidden",
              border: "2px solid var(--border)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with name and close button */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1.5rem 1.5rem 1rem",
              background: "var(--panel)",
              borderBottom: "1px solid var(--border)"
            }}>
              <h3 style={{ 
                margin: "0", 
                fontSize: "1.3rem", 
                fontWeight: "700"
              }}>
                {selectedPhoto.name}
              </h3>
              <button
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "50%",
                  width: "2.5rem",
                  height: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setSelectedPhoto(null)}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }}
              >
                ×
              </button>
            </div>
            
            {/* Photo */}
            <div style={{ padding: "0" }}>
              <img 
                src={selectedPhoto.photo} 
                alt={selectedPhoto.name}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  maxHeight: "450px",
                  objectFit: "cover"
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
/* ---------- End of Team Page ---------- */

/* ---------- Resources modal ---------- */
function Resources({ modalClose }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Resources">
      <div className="modal__card bubble resources-modal" style={{
        maxWidth: "700px",
        maxHeight: "100vh",
        width: "90vw"
      }}>
        <div className="modal__head">
          <div className="about-brand">
            <h3 style={{ fontSize: "1.4rem", margin: "0" }}>Resources used to create quiz</h3>
          </div>
          <button className="link" onClick={modalClose} aria-label="Close">✕</button>
        </div>

        <div className="modal__body" style={{
          maxHeight: "65vh",
          overflowY: "auto",
          padding: "1rem",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none", /* Internet Explorer 10+ */
        }}>
          <style jsx>{`
            .modal__body::-webkit-scrollbar {
              display: none; /* Safari and Chrome */
            }
          `}</style>

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

        <h4 className="mt">Implementation Cost & Timeline Sources</h4>
        <ul className="about-list">
          <li>
            <strong>IBM Cost of Data Breach Report 2024:</strong> Industry average costs and recovery timelines.
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://www.ibm.com/reports/data-breach">IBM Security</a>
          </li>
          <li>
            <strong>NIST Cybersecurity Framework 2.0:</strong> Implementation guidance and maturity models.
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://www.nist.gov/cyberframework">NIST.gov</a>
          </li>
          <li>
            <strong>CISA Small Business Cybersecurity Guide:</strong> Cost-effective security controls for organizations.
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://www.cisa.gov/resources-tools/resources/small-business-cybersecurity">CISA.gov</a>
          </li>
          <li>
            <strong>CIS Controls Implementation Guide:</strong> Priority order and implementation timelines.
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://www.cisecurity.org/controls">CIS Security</a>
          </li>
          <li>
            <strong>Ponemon Institute Security Research:</strong> Industry benchmarks and spending analysis.
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://www.ponemon.org/">Ponemon.org</a>
          </li>
        </ul>

        <h4 className="mt">Risk Assessment Methodology</h4>
        <ul className="about-list">
          <li>
            <strong>NIST SP 800-30:</strong> Risk Assessment methodology (Likelihood × Impact matrix).
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30.pdf">NIST SP 800-30</a>
          </li>
          <li>
            <strong>ISO 27005:</strong> Information security risk management standards.
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://www.iso.org/standard/75281.html">ISO 27005</a>
          </li>
          <li>
            <strong>FAIR Risk Model:</strong> Factor Analysis of Information Risk quantitative framework.
            {" "}<a target="_blank" rel="noopener noreferrer" href="https://www.fairinstitute.org/">FAIR Institute</a>
          </li>
        </ul>

        <h4 className="mt">Recommendations</h4>
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
        </div>

        <div className="cta">
          <button className="btn btn--primary" onClick={modalClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
/* ---- End of Resources modal --------*/

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
        const apiKey = import.meta.env.NEWSAPI_KEY;
        if (!apiKey) {
          setError('No NewsAPI key configured. Add NEWSAPI_KEY to your .env');
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
      <div className="modal__card bubble news-modal" style={{
        maxWidth: "600px",
        maxHeight: "60vh",
        width: "90vw"
      }}>
        <div className="modal__head">
          <div className="about-brand">
            <h3 style={{ fontSize: "1.4rem", margin: "0" }}>Latest Cybersecurity News</h3>
          </div>
          <button className="link" onClick={modalClose} aria-label="Close">✕</button>
        </div>

        <div className="modal__body" style={{
          maxHeight: "40vh",
          overflowY: "auto",
          padding: "1rem",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none", /* Internet Explorer 10+ */
        }}>
          <style jsx>{`
            .modal__body::-webkit-scrollbar {
              display: none; /* Safari and Chrome */
            }
          `}</style>
          {loading && <div style={{ padding: "1rem", textAlign: "center" }}>Loading news...</div>}
          {error && <div style={{ color: "red", padding: "1rem", textAlign: "center" }}>Error: {error}</div>}
          {!loading && !error && !news.length && <div style={{ padding: "1rem", textAlign: "center" }}>No recent articles found.</div>}

          {!loading && !error && news.length > 0 && (
            <ul className="about-list" style={{ margin: "0", padding: "0" }}>
              {news.slice(0, 4).map((item) => (
                <li key={item.url || item.publishedAt} style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border)",
                  listStyle: "none"
                }}>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      lineHeight: "1.4",
                      textDecoration: "underline",
                      color: "hsl(240, 100%, 70%)",
                      display: "block",
                      marginBottom: "0.5rem"
                    }}
                  >
                    {item.title}
                  </a>
                  <div style={{ 
                    fontSize: "0.8rem", 
                    color: "var(--muted)",
                    marginBottom: "0.5rem"
                  }}>
                    {item.source?.name || "Unknown source"} — {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Unknown date"}
                  </div>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "var(--text)",
                    opacity: "0.8",
                    lineHeight: "1.4"
                  }}>
                    {item.description ? (item.description.length > 120 ? item.description.substring(0, 120) + "..." : item.description) : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="cta" style={{ padding: "0.25rem 1rem 1rem", textAlign: "center" }}>
          <button className="btn btn--primary" onClick={modalClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
/* ----End of Cyber News modal------ */