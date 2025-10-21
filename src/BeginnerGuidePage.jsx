/* ---------- Beginner Guide page ---------- */
function BeginnerGuidePage({ onBack, theme }) {
  return (
    <div className="page">
      <div className="wrap">
        <div style={{ marginBottom: "2rem" }}>
          <button className="btn btn--ghost" onClick={onBack}>
            ← Back to Home
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "clamp(2rem, 1.5rem + 2.5vw, 3.5rem)", margin: "0 0 1rem 0" }}>
            🎯 Cybersecurity for Beginners
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
            Welcome to cybersecurity! This guide covers the essential basics to help you protect yourself and your organization online. No technical background required! 🛡️
          </p>
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h4>🚨 What is Cybersecurity?</h4>
          <p>Cybersecurity is like having locks, alarms, and security guards for your digital life. It protects your:</p>
          <ul className="about-list">
            <li><strong>Personal Information:</strong> Photos, emails, bank details, passwords</li>
            <li><strong>Business Data:</strong> Customer information, financial records, company secrets</li>
            <li><strong>Devices:</strong> Computers, phones, tablets from viruses and hackers</li>
          </ul>

          <h4>🎯 Common Threats (What to Watch Out For)</h4>
          <ul className="about-list">
            <li>
              <strong>Phishing Emails:</strong> Fake emails that look real, asking for passwords or personal info
              <br /><em>Red flags: Urgent language, suspicious links, asking for passwords</em>
            </li>
            <li>
              <strong>Malware/Viruses:</strong> Bad software that can steal data or damage your device
              <br /><em>Prevention: Don't download from untrusted sources, keep antivirus updated</em>
            </li>
            <li>
              <strong>Weak Passwords:</strong> Easy-to-guess passwords like "password123"
              <br /><em>Solution: Use long, unique passwords with a password manager</em>
            </li>
            <li>
              <strong>Public Wi-Fi Risks:</strong> Hackers can see what you do on unsecured networks
              <br /><em>Tip: Avoid banking/shopping on public Wi-Fi</em>
            </li>
          </ul>

          <h4>✅ Quick Wins (Start Here!)</h4>
          <div style={{ background: "var(--success-bg)", border: "1px solid var(--success-border)", borderRadius: "8px", padding: "1rem", margin: "1rem 0" }}>
            <h5 style={{ margin: "0 0 0.5rem 0", color: "var(--success-text)" }}>5-Minute Security Checkup</h5>
            <ol style={{ margin: "0", paddingLeft: "1.2rem" }}>
              <li>Turn on automatic updates for your phone/computer</li>
              <li>Use a password manager (we recommend Bitwarden - it's free!)</li>
              <li>Enable 2-factor authentication on email and important accounts</li>
              <li>Check your privacy settings on social media</li>
              <li>Install antivirus if you don't have it</li>
            </ol>
          </div>

          <h4>🛠️ Essential Tools (Free & Easy)</h4>
          <ul className="about-list">
            <li>
              <strong>Password Managers:</strong> Store all passwords securely
              <br />• <a href="https://bitwarden.com" target="_blank" rel="noopener noreferrer">Bitwarden</a> (Free, excellent)
              <br />• <a href="https://1password.com" target="_blank" rel="noopener noreferrer">1Password</a> (Paid, very user-friendly)
            </li>
            <li>
              <strong>Antivirus/Security:</strong> Protect against malware
              <br />• Windows Defender (built-in, free)
              <br />• <a href="https://www.malwarebytes.com" target="_blank" rel="noopener noreferrer">Malwarebytes</a> (free version available)
            </li>
            <li>
              <strong>2-Factor Authentication Apps:</strong> Extra security layer
              <br />• <a href="https://support.google.com/accounts/answer/1066447" target="_blank" rel="noopener noreferrer">Google Authenticator</a> (free)
              <br />• <a href="https://authy.com" target="_blank" rel="noopener noreferrer">Authy</a> (free, syncs across devices)
            </li>
          </ul>

          <h4>🧠 Remember These Golden Rules</h4>
          <ul className="about-list">
            <li><strong>Think before you click:</strong> Suspicious emails, links, or downloads</li>
            <li><strong>Keep everything updated:</strong> Software updates often fix security holes</li>
            <li><strong>Use unique passwords:</strong> One password = one account</li>
            <li><strong>Trust your gut:</strong> If something feels fishy, it probably is</li>
            <li><strong>Backup important files:</strong> Save copies somewhere safe</li>
          </ul>

          <h4>📚 Want to Learn More?</h4>
          <ul className="about-list">
            <li><a href="https://www.cisa.gov/cybersecurity-basics" target="_blank" rel="noopener noreferrer">CISA Cybersecurity Basics</a> - Government resource</li>
            <li><a href="https://staysafeonline.org/stay-safe-online/securing-personal-information/passwords/" target="_blank" rel="noopener noreferrer">Stay Safe Online</a> - Password best practices</li>
            <li><a href="https://www.knowbe4.com/phishing" target="_blank" rel="noopener noreferrer">KnowBe4 Phishing Guide</a> - Spot fake emails</li>
          </ul>

          <div style={{ 
            marginTop: "3rem", 
            padding: "2rem", 
            background: "var(--panel)", 
            borderRadius: "12px", 
            border: "1px solid var(--border)",
            textAlign: "center"
          }}>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--primary)" }}>Ready to test your knowledge?</h3>
            <p style={{ margin: "0 0 1.5rem 0", fontSize: "1rem", color: "var(--text-muted)" }}>
              Take our cybersecurity assessment to see how well you're protected!
            </p>
            <button className="btn btn--primary" onClick={onBack}>
              Take Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeginnerGuidePage;