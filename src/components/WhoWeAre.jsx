/* ========================================
   WHO WE ARE MODAL COMPONENT
   
   Information about Mission Secure and the cybersecurity assessment platform.
   Extracted from App.jsx for better code organization.
======================================== */

export default function WhoWeAre({ modalClose, onNavigateToTeam }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="whoWeAreTitle">
      <div className="modal__card bubble WhoWeAre-modal" style={{
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        <div className="modal__head">
          <div className="WhoWeAre-brand">
            <h3 id="whoWeAreTitle">Who We Are</h3>
          </div>
          <button className="link" onClick={modalClose} aria-label="Close Who We Are modal">✕</button>
        </div>
        
        <div style={{
          flex: "1",
          overflowY: "auto",
          padding: "0 1rem",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none", /* Internet Explorer 10+ */
        }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Safari and Chrome */
            }
          `}</style>
        
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
        </div>

        {/* actions - Fixed at bottom */}
        <div className="cta" style={{ 
          display: "flex", 
          gap: 12, 
          flexWrap: "wrap",
          padding: "1rem",
          borderTop: "1px solid var(--border)",
          marginTop: "auto",
          backgroundColor: "var(--panel)"
        }}>
          <button className="btn btn--primary" onClick={modalClose} autoFocus>Got it</button>
          <button
            className="btn btn--secondary"
            onClick={() => {
              modalClose();
              onNavigateToTeam();
            }}
          >
            Meet the Team
          </button>
        </div>
      </div>
    </div>
  );
}