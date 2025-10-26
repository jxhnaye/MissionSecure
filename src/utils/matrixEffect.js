/* ========================================
   MATRIX RAIN EFFECT (MIDNIGHT MODE)
   
   Animated Matrix-style falling characters for midnight mode easter egg.
   Extracted from App.jsx for better code organization.
======================================== */

let matrixCanvas = null;
let matrixCtx = null;
let matrixAnimation = null;

/**
 * Start Matrix rain animation overlay
 */
export function startMatrixRain() {
  if (matrixCanvas) return; // Already running

  matrixCanvas = document.createElement('canvas');
  matrixCanvas.style.position = 'fixed';
  matrixCanvas.style.top = '0';
  matrixCanvas.style.left = '0';
  matrixCanvas.style.width = '100vw';
  matrixCanvas.style.height = '100vh';
  matrixCanvas.style.pointerEvents = 'none';
  matrixCanvas.style.zIndex = '1';
  matrixCanvas.style.opacity = '0.3';
  
  document.body.appendChild(matrixCanvas);
  
  matrixCtx = matrixCanvas.getContext('2d');
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|\\:;\"'<>?/~`";
  const fontSize = 14;
  const columns = matrixCanvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);
  
  function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    matrixCtx.fillStyle = '#00ff41'; // Classic Matrix green
    matrixCtx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  
  matrixAnimation = setInterval(drawMatrix, 33); // ~30 FPS
  
  // Handle window resize
  const handleResize = () => {
    if (matrixCanvas) {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  // Store cleanup function for resize listener
  matrixCanvas._cleanupResize = () => {
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * Stop Matrix rain animation and cleanup
 */
export function stopMatrixRain() {
  if (matrixAnimation) {
    clearInterval(matrixAnimation);
    matrixAnimation = null;
  }
  
  if (matrixCanvas) {
    // Cleanup resize listener
    if (matrixCanvas._cleanupResize) {
      matrixCanvas._cleanupResize();
    }
    
    document.body.removeChild(matrixCanvas);
    matrixCanvas = null;
    matrixCtx = null;
  }
}