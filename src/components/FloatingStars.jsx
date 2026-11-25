import { useEffect, useRef } from 'react';

/**
 * FloatingStars — Efeito sutil de estrelas brancas em céu noturno.
 * Renderizado em <canvas> dedicado com pointer-events: none,
 * respeitando prefers-reduced-motion e adaptando densidade ao viewport.
 */
export default function FloatingStars({
  className = '',
  desktopCount = 42,
  mobileCount = 22,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let rafId = null;

    const createStar = (w, h, randomizeX = true) => {
      const depth = Math.random(); // 0 (longe/lento) -> 1 (perto/suave)
      const isGlowing = Math.random() < 0.32;
      const radius = 0.65 + depth * 1.15;
      const baseOpacity = 0.14 + depth * 0.56;
      const speedX = -(0.07 + depth * 0.18); // deslize lento da direita p/ esquerda
      const speedY = -(0.015 + depth * 0.045); // leve diagonal ascendente

      return {
        x: randomizeX ? Math.random() * w : w + 12 + Math.random() * 40,
        y: Math.random() * h,
        radius,
        baseOpacity,
        twinkleSpeed: 0.004 + Math.random() * 0.009,
        twinklePhase: Math.random() * Math.PI * 2,
        speedX,
        speedY,
        isGlowing,
      };
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect?.width || window.innerWidth));
      height = Math.max(1, Math.floor(rect?.height || window.innerHeight));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 768 ? mobileCount : desktopCount;
      stars = Array.from({ length: count }, () => createStar(width, height, true));
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!prefersReducedMotion) {
          s.x += s.speedX;
          s.y += s.speedY;
          s.twinklePhase += s.twinkleSpeed;

          // Reentrada suave e imperceptível pelas bordas opostas
          if (s.x < -16) {
            s.x = width + 14;
            s.y = Math.random() * height;
          }
          if (s.y < -16) {
            s.y = height + 14;
            s.x = Math.random() * width;
          }
        }

        // Suave fade perto das bordas para aparição/desaparecimento orgânicos
        const edgeFadeX = Math.min(
          1,
          Math.max(0, Math.min(s.x / 60, (width - s.x) / 60))
        );
        const edgeFadeY = Math.min(
          1,
          Math.max(0, Math.min(s.y / 60, (height - s.y) / 60))
        );
        const twinkle = prefersReducedMotion
          ? 0.85
          : 0.55 + 0.45 * Math.sin(s.twinklePhase);
        const alpha = s.baseOpacity * twinkle * edgeFadeX * edgeFadeY;

        if (alpha <= 0.01) continue;

        ctx.save();
        if (s.isGlowing) {
          ctx.shadowBlur = 7;
          ctx.shadowColor = `rgba(255, 255, 255, ${Math.min(0.65, alpha * 0.9)})`;
        }
        ctx.fillStyle = `rgba(252, 251, 248, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    resize();
    drawFrame();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [desktopCount, mobileCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`floating-stars ${className}`}
      aria-hidden="true"
    />
  );
}
