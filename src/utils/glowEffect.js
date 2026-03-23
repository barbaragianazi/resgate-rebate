let isInitialized = false;
let animationFrameId = null;
let lastMousePos = { x: 0, y: 0 };

export function initGlowEffect() {
  if (isInitialized) return;
  isInitialized = true;

  const handlePointerMove = (e) => {
    if (e) {
      lastMousePos.x = e.clientX;
      lastMousePos.y = e.clientY;
    }

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      const cards = document.querySelectorAll('.product-card');

      cards.forEach(card => {
        const glowEl = card.querySelector('.glow-effect');
        if (!glowEl) return;

        const rect = card.getBoundingClientRect();
        const mouseX = lastMousePos.x;
        const mouseY = lastMousePos.y;

        const center = [rect.left + rect.width * 0.5, rect.top + rect.height * 0.5];
        const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1]);

        // Define proximity - how far the mouse can be to still illuminate the border
        const proximity = 64;
        const inactiveZone = 0.01;
        const inactiveRadius = 0.5 * Math.min(rect.width, rect.height) * inactiveZone;

        if (distanceFromCenter < inactiveRadius) {
          glowEl.style.setProperty('--active', "0");
          return;
        }

        const isActive =
          mouseX > rect.left - proximity &&
          mouseX < rect.left + rect.width + proximity &&
          mouseY > rect.top - proximity &&
          mouseY < rect.top + rect.height + proximity;

        glowEl.style.setProperty('--active', isActive ? "1" : "0");

        if (!isActive) return;

        // Calculate angle pointing from center to mouse
        let targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;

        // Pure JS direct update (since we use smooth transitions in CSS if desired, or direct setting)
        // Set the angle directly on the glow element
        glowEl.style.setProperty('--start', targetAngle.toFixed(2));
      });
    });
  };

  document.body.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('scroll', () => handlePointerMove(), { passive: true });
}
