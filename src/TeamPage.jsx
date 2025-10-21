import { useState } from "react";
import benjaminPhoto from "./assets/team/benjamin.jpg.png";
import lailaPhoto from "./assets/team/laila.jpg.png";
import carolinePhoto from "./assets/team/caroline.jpg.png";
import raePhoto from "./assets/team/rae.jpg.png";
import milesPhoto from "./assets/team/miles.jpg.jpg";
import johnPhoto from "./assets/team/john.jpg.png";
import jonathanPhoto from "./assets/team/jonathan.jpg.png";

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

/* ---------- Team Page ---------- */
function TeamPage({ onBack, theme }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [easterEggModal, setEasterEggModal] = useState(null);
  const [easterEggCount, setEasterEggCount] = useState({});
  
  const initials = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0,2).map(s=>s[0]).join("").toUpperCase();

  // Easter egg messages for each team member
  const easterEggMessages = {
    "⚽": { 
      messages: [
        "GOOOAL! ⚽ Benjamin scores for CSUN!",
        "🏆 Benjamin is dribbling through cybersecurity like Messi!",
        "⚽ Fun fact: Benjamin can secure a network faster than a penalty kick!"
      ],
      color: "#4CAF50"
    },
    "🍵": {
      messages: [
        "🍵 *sips matcha* Laila is brewing up some data science magic!",
        "🧠 Matcha + Data Science = Pure genius! That's Laila!",
        "🍵 Fun fact: Laila's algorithms are as smooth as her matcha lattes!"
      ],
      color: "#66BB6A"
    },
    "🌟": {
      messages: [
        "✨ Aaliyah shines bright like a cybersecurity star!",
        "🌟 Technology engineering meets stellar personality!",
        "⭐ Aaliyah: Making Langston University proud, one byte at a time!"
      ],
      color: "#FFD700"
    },
    "📚": {
      messages: [
        "📖 Caroline is the project manager who reads between the lines!",
        "📚 Adventure awaits! Caroline leads our team on epic coding quests!",
        "🗺️ Caroline: Navigating project timelines like a literary adventure!"
      ],
      color: "#FF7043"
    },
    "🏎️": {
      messages: [
        "🏁 Jonathan codes at Formula 1 speed! Database queries go VROOM!",
        "🏈 Touchdown! Jonathan scores with perfect database schemas!",
        "🏔️ From snowboard slopes to data slopes - Jonathan conquers all!"
      ],
      color: "#F44336"
    },
    "🕹️": {
      messages: [
        "🎮 Miles: Collecting retro tech AND building modern solutions!",
        "👾 ERROR 404: Miles' vintage game collection not found (it's too massive)!",
        "🕹️ From Atari to APIs - Miles bridges all eras of technology!"
      ],
      color: "#9C27B0"
    },
    "🎨": {
      messages: [
        "🖌️ Janie paints beautiful code like she paints on canvas!",
        "📺 Binge-watching shows for 'research' - classic Janie move!",
        "🎨 Janie: Making frontend interfaces as beautiful as her artwork!"
      ],
      color: "#E91E63"
    },
    "🎵": {
      messages: [
        "🎶 John codes to the rhythm! His backend beats are 🔥!",
        "🏂 From powder to programming - John shreds code like fresh snow!",
        "🎤 John's API responses are music to our ears!"
      ],
      color: "#3F51B5"
    },
    "✈️": {
      messages: [
        "🛡️ Rae: Flying high with CyberSloth Security wisdom!",
        "✈️ Dreaming big and securing bigger! That's the Rae way!",
        "🎭 Art meets cybersecurity - Rae brings creativity to digital defense!"
      ],
      color: "#00BCD4"
    }
  };

  const handleEmojiClick = (emoji, memberName) => {
    const count = (easterEggCount[emoji] || 0) + 1;
    setEasterEggCount(prev => ({ ...prev, [emoji]: count }));
    
    const emojiData = easterEggMessages[emoji];
    if (emojiData) {
      const messageIndex = (count - 1) % emojiData.messages.length;
      const message = emojiData.messages[messageIndex];
      
      // Special achievement for persistent clickers
      if (count === 5) {
        setEasterEggModal({
          title: "🏆 ACHIEVEMENT UNLOCKED!",
          message: `${memberName} Super Fan!`,
          subtitle: `You've clicked ${emoji} 5 times! You're officially obsessed! 😄`,
          color: "#FFD700",
          emoji: "🏆",
          memberName: memberName,
          isAchievement: true
        });
      } else {
        setEasterEggModal({
          title: `${emoji} ${memberName}`,
          message: message,
          subtitle: `Click count: ${count} | ${3 - (count % 3)} more for next message`,
          color: emojiData.color,
          emoji: emoji,
          memberName: memberName,
          isAchievement: false
        });
      }
    }
  };

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
          <span style={{ fontSize: "0.9rem", opacity: "0.7", display: "block", marginTop: "0.5rem" }}>
            💡 Tip: Click on team member emojis for fun surprises! 🎉
          </span>
        </p>
      </div>

      {/* Easter Egg Modal Popup */}
      {easterEggModal && (
        <div 
          className="modal" 
          style={{ 
            position: "fixed", 
            inset: 0, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            background: "rgba(0, 0, 0, 0.7)", 
            zIndex: 2000,
            padding: "2rem",
            animation: "fadeIn 0.3s ease-out"
          }}
          onClick={() => setEasterEggModal(null)}
        >
          <div 
            style={{
              background: "var(--panel)",
              borderRadius: "1.5rem",
              padding: "2rem",
              maxWidth: "450px",
              width: "90%",
              textAlign: "center",
              border: `3px solid ${easterEggModal.color}`,
              boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 20px ${easterEggModal.color}40`,
              animation: "bounceIn 0.4s ease-out",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
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
              onClick={() => setEasterEggModal(null)}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              ×
            </button>

            {/* Large emoji */}
            <div style={{ 
              fontSize: "4rem", 
              marginBottom: "1rem",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
            }}>
              {easterEggModal.emoji}
            </div>

            {/* Title */}
            <h3 style={{ 
              margin: "0 0 1rem", 
              color: easterEggModal.color,
              fontSize: easterEggModal.isAchievement ? "1.8rem" : "1.5rem",
              fontWeight: "800"
            }}>
              {easterEggModal.title}
            </h3>

            {/* Main message */}
            <p style={{ 
              margin: "0 0 1rem", 
              fontSize: "1.1rem",
              lineHeight: "1.5",
              color: "var(--text)",
              fontWeight: "600"
            }}>
              {easterEggModal.message}
            </p>

            {/* Subtitle */}
            <p style={{ 
              margin: "0 0 1.5rem", 
              fontSize: "0.9rem",
              color: "var(--muted)",
              opacity: "0.8"
            }}>
              {easterEggModal.subtitle}
            </p>

            {/* Action button */}
            <button
              style={{
                background: `linear-gradient(45deg, ${easterEggModal.color}, ${easterEggModal.color}DD)`,
                color: "white",
                border: "none",
                borderRadius: "0.75rem",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: `0 4px 15px ${easterEggModal.color}40`
              }}
              onClick={() => setEasterEggModal(null)}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = `0 6px 20px ${easterEggModal.color}60`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 4px 15px ${easterEggModal.color}40`;
              }}
            >
              {easterEggModal.isAchievement ? "Awesome! 🎉" : "Got it! 😊"}
            </button>
          </div>
        </div>
      )}

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
            {/* Large emoji decoration on the right - Now clickable! */}
            {member.emoji && (
              <div 
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  fontSize: "4rem",
                  opacity: "0.6",
                  cursor: "pointer",
                  zIndex: 2,
                  transition: "all 0.2s ease",
                  userSelect: "none"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmojiClick(member.emoji, member.name);
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = "1";
                  e.target.style.transform = "scale(1.1) rotate(10deg)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = "0.6";
                  e.target.style.transform = "scale(1) rotate(0deg)";
                }}
                title={`Click ${member.emoji} for a surprise! 🎉`}
              >
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

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}

export default TeamPage;