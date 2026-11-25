import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingStars from './FloatingStars';
import { FINAL_MEMORIES_CONFIG } from '../config/experienceConfig';

gsap.registerPlugin(ScrollTrigger);

export default function FinalMemories({ onScrollToTop }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const bgImgRef = useRef(null);
  const introRef = useRef(null);
  const overlayRefs = useRef([]);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleChange = (e) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const orderedOverlays = useMemo(
    () =>
      [...FINAL_MEMORIES_CONFIG.overlays].sort((a, b) => a.order - b.order),
    []
  );

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(introRef.current, { opacity: 0 });
        orderedOverlays.forEach((item, idx) => {
          const el = overlayRefs.current[idx];
          if (el) {
            gsap.set(el, {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              rotation: item.rotation,
            });
          }
        });
        return;
      }

      const scrollDistance = isMobile
        ? Math.round(FINAL_MEMORIES_CONFIG.scrollLengthVh * 0.78)
        : FINAL_MEMORIES_CONFIG.scrollLengthVh;

      // Initial states
      gsap.set(bgImgRef.current, { scale: 1.07 });

      orderedOverlays.forEach((item, idx) => {
        const el = overlayRefs.current[idx];
        if (!el) return;
        const offsetScale = isMobile ? 0.55 : 1;
        gsap.set(el, {
          opacity: 0,
          scale: 0.78,
          x: item.fromOffset.x * offsetScale,
          y: item.fromOffset.y * offsetScale,
          rotation:
            item.rotation + (item.fromOffset.x >= 0 ? 5.5 : -5.5),
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: `+=${scrollDistance}%`,
          pin: true,
          scrub: 1.05,
          anticipatePin: 1,
        },
      });

      // Subtle continuous cinematic settle on the full-viewport background photo
      tl.to(
        bgImgRef.current,
        {
          scale: 1,
          duration: orderedOverlays.length + 2.2,
          ease: 'none',
        },
        0
      );

      // Fade out initial scroll prompt early as memories begin appearing
      tl.to(
        introRef.current,
        {
          opacity: 0,
          y: -16,
          duration: 0.65,
          ease: 'power2.out',
        },
        0.15
      );

      // Progressively layer each memory photograph onto the background
      orderedOverlays.forEach((item, idx) => {
        const el = overlayRefs.current[idx];
        if (!el) return;
        const startAt = 0.55 + idx * 0.82;
        tl.to(
          el,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotation: item.rotation,
            duration: 1.05,
            ease: 'power3.out',
          },
          startAt
        );
      });

      // Short breathing pause at the completed mural before unpinning
      tl.to({}, { duration: 0.9 });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, orderedOverlays]);

  return (
    <section
      id="final"
      ref={sectionRef}
      className="final-section"
      aria-label="Capítulo 03 — Memórias Finais"
    >
      <div ref={stageRef} className="final-stage">
        <div className="final-bg">
          <img
            ref={bgImgRef}
            src={FINAL_MEMORIES_CONFIG.background.src}
            alt={FINAL_MEMORIES_CONFIG.background.alt}
            className="final-bg__img"
            style={{
              objectPosition: FINAL_MEMORIES_CONFIG.background.objectPosition,
            }}
            loading="lazy"
            decoding="async"
          />
          <div className="final-bg__vignette" aria-hidden="true" />
        </div>

        <FloatingStars
          className="final-stars"
          desktopCount={30}
          mobileCount={16}
        />

        <div ref={introRef} className="final-intro">
          <p className="final-intro__label">
            {FINAL_MEMORIES_CONFIG.chapterLabel}
          </p>
          <p className="final-intro__prompt">
            {FINAL_MEMORIES_CONFIG.introPrompt}
          </p>
        </div>

        <div className="final-overlays">
          {orderedOverlays.map((item, idx) => {
            const layout = isMobile ? item.mobile : item.desktop;
            return (
              <figure
                key={item.id}
                ref={(el) => {
                  overlayRefs.current[idx] = el;
                }}
                className="final-memory"
                style={{
                  top: layout.top,
                  right: layout.right,
                  bottom: layout.bottom,
                  left: layout.left,
                  width: layout.width,
                  aspectRatio: layout.aspectRatio,
                  zIndex: item.zIndex,
                }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="final-memory__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            );
          })}
        </div>
      </div>

      <footer className="colophon">
        <span className="colophon__note">
          MARCELO — UMA HOMENAGEM EM MEMÓRIAS
        </span>
        <button
          type="button"
          className="colophon__replay"
          onClick={onScrollToTop}
        >
          Voltar ao início
        </button>
      </footer>
    </section>
  );
}
