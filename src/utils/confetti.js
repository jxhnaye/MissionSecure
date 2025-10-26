/* ========================================
   CONFETTI CASCADE ANIMATION
   
   Visual celebration effect for high scores.
   Extracted from App.jsx for better code organization.
======================================== */

/**
 * Create cascading confetti animation overlay
 * @param {number} totalMs - Total animation duration in milliseconds
 * @param {number} batch - Number of confetti pieces per batch
 * @param {number} everyMs - Interval between batches in milliseconds
 */
export function confettiCascade(totalMs = 5000, batch = 28, everyMs = 110) {
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

  const interval = setInterval(() => { 
    for (let i = 0; i < batch; i++) makePiece(); 
  }, everyMs);
  
  setTimeout(() => {
    clearInterval(interval);
    const extra = (MAX_DELAY + MAX_DUR) * 1000 + 400;
    setTimeout(() => container.remove(), extra);
  }, totalMs);
}