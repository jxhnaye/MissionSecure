import { useEffect, useMemo, useState } from "react";
import "./App.css";
import darkLogo from "./assets/mission-secureb.png";
import lightLogo from "./assets/mission-securew.png";
import ContactUs from "./ContactUs";
import BeginnerGuidePage from "./BeginnerGuidePage";
import TeamPage from "./TeamPage";
import CyberNews from "./CyberNews";
import WhoWeAre from "./components/WhoWeAre";
import Resources from "./components/Resources";
import emailjs from '@emailjs/browser';
import { localScoreAndNotes } from "./utils/scoringEngine";
import { BASE_QUESTIONS } from "./data/questions";
import { shuffle, pctToHue, gradeWithAI, getSessionId, QUIZ_ID } from "./utils/helpers";
import { confettiCascade } from "./utils/confetti";
import { startMatrixRain, stopMatrixRain } from "./utils/matrixEffect";

/* ========================================
   MAIN APPLICATION COMPONENT
======================================== */

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [view, setView] = useState("landing"); // landing | quiz | results | team | beginner-guide
  const [WhoWeAreOpen, setWhoWeAreOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [cyberNewsOpen, setCyberNewsOpen] = useState(false);
  const [prefetchedNews, setPrefetchedNews] = useState(null);

  const [qs, setQs] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  // Midnight Mode Easter Egg
  const [midnightMode, setMidnightMode] = useState(false);
  const [showMidnightAlert, setShowMidnightAlert] = useState(false);

  // Email Capture for Thank You
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  // Mobile Menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Midnight Mode Detection
  useEffect(() => {
    const checkMidnightMode = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      // Activate between 12:00 AM (0:00) and 12:59 AM (0:59)
      const isMidnight = hour === 0;
      
      if (isMidnight && !midnightMode) {
        setMidnightMode(true);
        setShowMidnightAlert(true);
        document.body.classList.add('midnight-mode');
        startMatrixRain();
        
        // Auto-hide alert after 5 seconds
        setTimeout(() => setShowMidnightAlert(false), 5000);
      } else if (!isMidnight && midnightMode) {
        setMidnightMode(false);
        document.body.classList.remove('midnight-mode');
        stopMatrixRain();
      }
    };

    // Check immediately
    checkMidnightMode();
    
    // Check every minute
    const interval = setInterval(checkMidnightMode, 60000);
    
    return () => clearInterval(interval);
  }, [midnightMode]);

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

  /* ========================================
     SCORING & ASSESSMENT LOGIC
  ======================================== */

  async function finish(finalAns) {
    const { percent, notes, categoryScores, maturityBonus } = localScoreAndNotes(finalAns, qs || BASE_QUESTIONS);
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
    
    // Show email capture modal after a short delay
    setTimeout(() => setShowEmailModal(true), 2000);
  }

  // Email Functions
  const sendThankYouEmail = async () => {
    if (!userEmail || !result) return;
    
    setEmailSending(true);
    
    try {
      // EmailJS configuration
      const serviceId = 'service_zp1s8kn';
      const templateId = 'template_2qd8uas';
      const publicKey = 'dqeHV_5inh7XPvunn';

      const templateParams = {
        user_email: userEmail,
        company_name: companyName && companyName.trim() ? companyName : '',
        assessment_score: result.score,
        security_level: result.securityLevel,
        assessment_date: new Date(result.dateISO).toLocaleDateString()
      };

      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      alert(`Thank you! We've sent your results to ${userEmail}. Check your inbox!`);
      setShowEmailModal(false);
      setUserEmail('');
      setCompanyName('');
      
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Sorry, there was an issue sending the email. Please try again later.');
    }
    
    setEmailSending(false);
  };

  // Cyber news functions
  const onCyberNews = () => setCyberNewsOpen(true);
  
  const onPrefetchNews = async () => {
    if (prefetchedNews) return; // Already prefetched
    try {
      const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
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



      {/* Midnight Mode CSS */}
      <style jsx>{`
        .midnight-mode {
          background: #000000 !important;
        }
        
        .midnight-mode * {
          text-shadow: 0 0 10px #00ff41;
        }
        
        .midnight-mode .topbar {
          background: linear-gradient(135deg, #000000, #1a1a1a) !important;
          border-bottom: 1px solid #00ff41 !important;
        }
        
        .midnight-mode .btn--primary {
          background: linear-gradient(45deg, #00ff41, #00cc33) !important;
          color: #000000 !important;
          box-shadow: 0 0 20px #00ff4140 !important;
        }
        
        .midnight-mode .btn--ghost {
          border: 1px solid #00ff41 !important;
          color: #00ff41 !important;
        }
        
        .midnight-mode .btn--ghost:hover {
          background: #00ff4120 !important;
        }
        
        @keyframes matrixGlow {
          0% {
            box-shadow: 0 0 30px #00ff4160, inset 0 0 20px #00ff4120;
          }
          100% {
            box-shadow: 0 0 50px #00ff4180, inset 0 0 30px #00ff4140;
          }
        }
      `}</style>

      <Header
        theme={theme}
        setTheme={setTheme}
        onWhoWeAre={() => setWhoWeAreOpen(true)}
        onResources={() => setResourcesOpen(true)}
        onCyberNews={onCyberNews}
        onPrefetchNews={onPrefetchNews}
        onStart={start}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Menu Modal */}
      {mobileMenuOpen && (
        <div className="modal mobile-menu-modal" onClick={() => setMobileMenuOpen(false)}>
          <div className="modal__card mobile-menu-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal__head">
              <h3>Menu</h3>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                ×
              </button>
            </div>
            <div className="mobile-menu-items">
              <ContactUs />
              <button
                className="btn btn--ghost mobile-menu-btn"
                onClick={() => {
                  onCyberNews();
                  setMobileMenuOpen(false);
                }}
                onMouseEnter={onPrefetchNews}
                onFocus={onPrefetchNews}
              >
                <span role="img" aria-label="newspaper">📰</span> Latest Cyber News
              </button>
              <button 
                className="btn btn--ghost mobile-menu-btn" 
                onClick={() => {
                  setWhoWeAreOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Who We Are
              </button>
              <button 
                className="btn btn--primary mobile-menu-btn" 
                onClick={() => {
                  start();
                  setMobileMenuOpen(false);
                }}
              >
                Take assessment
              </button>
              <button 
                className="btn btn--ghost mobile-menu-btn" 
                onClick={() => {
                  setResourcesOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Resources
              </button>
              <div className="mobile-menu-theme">
                <span style={{ marginRight: '1rem', color: 'var(--text)' }}>Theme:</span>
                <div className="theme-toggle" aria-label="Theme toggle">
                  <input
                    id="mobileThemeSwitch"
                    type="checkbox"
                    checked={theme === "light"}
                    onChange={e => setTheme(e.target.checked ? "light" : "dark")}
                  />
                  <label htmlFor="mobileThemeSwitch" title="Light / Dark">
                    <span className="sun">☀️</span>
                    <span className="moon">🌙</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

          {/* Midnight Mode Alert - positioned below Take Assessment */}
          {showMidnightAlert && (
            <div 
              style={{
                marginTop: '40px',
                background: 'linear-gradient(45deg, #000000, #1a1a1a)',
                color: '#00ff41',
                padding: '25px 35px',
                borderRadius: '20px',
                border: '2px solid #00ff41',
                boxShadow: '0 0 40px #00ff4160, inset 0 0 25px #00ff4120',
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                textAlign: 'center',
                animation: 'matrixGlow 2s ease-in-out infinite alternate',
                maxWidth: '600px',
                margin: '40px auto 0'
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>🕛 MIDNIGHT MODE ACTIVATED 🕛</div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>Welcome to the dark side of cybersecurity...</div>
              <div style={{ fontSize: '14px', opacity: '0.8', marginTop: '10px' }}>
                Active until 1:00 AM | Matrix rain enabled | You are now in hacker mode
              </div>
            </div>
          )}
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
      {view === "beginner-guide" && <BeginnerGuidePage onBack={() => setView("landing")} theme={theme} />}

      {WhoWeAreOpen && <WhoWeAre modalClose={() => setWhoWeAreOpen(false)} onNavigateToTeam={() => setView("team")} />}
      {resourcesOpen && <Resources modalClose={() => setResourcesOpen(false)} onNavigateToBeginner={() => setView("beginner-guide")} />}
      {cyberNewsOpen && <CyberNews modalClose={() => setCyberNewsOpen(false)} initialNews={prefetchedNews} />}

      {/* Email Capture Modal */}
      {showEmailModal && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Email Results">
          <div className="modal__card bubble" style={{
            maxWidth: "500px",
            padding: "2rem"
          }}>
            <div className="modal__head">
              <h3 style={{ margin: "0", fontSize: "1.5rem", color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>
                📧 Get Your Results by Email
              </h3>
              <button className="link" onClick={() => setShowEmailModal(false)} aria-label="Close">✕</button>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ 
                margin: "0 0 1.5rem", 
                color: theme === 'light' ? '#666' : '#a3a7b3',
                lineHeight: "1.5"
              }}>
                Thank you for taking our cybersecurity assessment! We'd love to send you a copy of your results 
                and a personalized thank-you message from the Mission Secure team.
              </p>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "0.5rem", 
                  fontWeight: "600",
                  color: theme === 'light' ? '#17181c' : '#e9e9ef'
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--panel)",
                    color: "var(--text)",
                    fontSize: "1rem"
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "0.5rem", 
                  fontWeight: "600",
                  color: theme === 'light' ? '#17181c' : '#e9e9ef'
                }}>
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Organization"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--panel)",
                    color: "var(--text)",
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div style={{ 
                background: theme === 'light' ? 'rgba(124, 92, 255, 0.1)' : 'rgba(124, 92, 255, 0.15)', 
                padding: "1rem", 
                borderRadius: "8px",
                marginBottom: "1.5rem",
                border: theme === 'light' ? '1px solid rgba(124, 92, 255, 0.2)' : '1px solid rgba(124, 92, 255, 0.3)'
              }}>
                <p style={{ margin: "0", fontSize: "0.9rem", color: theme === 'light' ? '#17181c' : '#e9e9ef' }}>
                  🛡️ <strong>Privacy Note:</strong> This is an educational project by LA Tech Org. 
                  Your email will only be used to send your assessment results and will not be shared or sold.
                </p>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  className="btn btn--ghost"
                  onClick={() => setShowEmailModal(false)}
                  disabled={emailSending}
                >
                  Skip
                </button>
                <button
                  className="btn btn--primary"
                  onClick={sendThankYouEmail}
                  disabled={!userEmail || emailSending}
                  style={{
                    opacity: (!userEmail || emailSending) ? 0.6 : 1,
                    cursor: (!userEmail || emailSending) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {emailSending ? '📧 Sending...' : '📧 Send Results'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

/* ========================================
   UI COMPONENTS & MODALS
======================================== */

function Header({ theme, setTheme, onWhoWeAre, onResources, onCyberNews, onPrefetchNews, onStart, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <header className="topbar">
      <div className="rail">
        <div 
          className="brand" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={theme === "light" ? lightLogo : darkLogo}
            alt="Mission Secure"
            className="logo"
          />
          <h2>
            Cyber Hygiene Test <span className="by">by Mission Secure</span>
          </h2>
        </div>

        {/* everything below scrolls together with the brand */}
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

/* ========================================
   END OF MISSION SECURE APPLICATION
======================================== */