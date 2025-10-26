/* ========================================
   RESOURCES MODAL COMPONENT
   
   References and resources used to create the cybersecurity assessment.
   Extracted from App.jsx for better code organization.
======================================== */

export default function Resources({ modalClose, onNavigateToBeginner }) {
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
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button 
              className="btn btn--ghost" 
              onClick={() => {
                modalClose(); // Close resources modal
                onNavigateToBeginner(); // Navigate to beginner guide page
              }}
              style={{ fontSize: "0.85rem", padding: "0.5rem 0.8rem" }}
            >
              🎯 New to cybersecurity?
            </button>
            <button className="link" onClick={modalClose} aria-label="Close">✕</button>
          </div>
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