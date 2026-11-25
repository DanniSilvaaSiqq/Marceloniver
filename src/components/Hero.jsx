import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_CONFIG } from '../config/experienceConfig';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ ready = true }) {
  const sectionRef = useRef(null);
  const bgImgRef = useRef(null);
  const leftWordRef = useRef(null);
  const rightWordRef = useRef(null);
  const cardRef = useRef(null);
  const portraitRef = useRef(null);
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (!ready && !prefersReducedMotion) {
        gsap.set(
          [
            bgImgRef.current,
            leftWordRef.current,
            rightWordRef.current,
            cardRef.current,
            footerRef.current,
          ],
          { opacity: 0 }
        );
        return;
      }

      if (prefersReducedMotion) {
        gsap.set(
          [
            bgImgRef.current,
            leftWordRef.current,
            rightWordRef.current,
            cardRef.current,
            portraitRef.current,
            footerRef.current,
          ],
          { opacity: 1, x: 0, y: 0, scale: 1 }
        );
        return;
      }

      const { animation } = HERO_CONFIG;

      // Choreographed editorial entrance:
      // 1. Background settles -> 2. MAR enters left -> 3. CELO enters right
      // 4. Central photo frame scales & fades in -> 5. All elements lock together
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        bgImgRef.current,
        { opacity: 0, scale: 1.07 },
        {
          opacity: 1,
          scale: 1,
          duration: animation.bgDuration,
          ease: 'power2.out',
        },
        0
      )
        .fromTo(
          leftWordRef.current,
          { x: -115, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: animation.wordsDuration,
            ease: 'power4.out',
          },
          animation.wordsDelay
        )
        .fromTo(
          rightWordRef.current,
          { x: 115, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: animation.wordsDuration,
            ease: 'power4.out',
          },
          animation.wordsDelay
        )
        .fromTo(
          cardRef.current,
          { scale: 0.82, opacity: 0, y: 14 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: animation.cardDuration,
            ease: 'power4.out',
          },
          animation.cardDelay
        )
        .fromTo(
          portraitRef.current,
          { scale: 1.15 },
          {
            scale: 1,
            duration: animation.cardDuration + 0.3,
            ease: 'power3.out',
          },
          animation.cardDelay
        )
        .fromTo(
          footerRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
          },
          animation.metaDelay
        );

      // Gentle editorial scroll parallax exiting Hero into Chapter 02
      gsap.to(bgImgRef.current, {
        yPercent: 12,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(cardRef.current, {
        y: -38,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero"
      aria-label="Capítulo 01 — Marcelo"
    >
      <div className="hero__bg-wrap" aria-hidden="true">
        <img
          ref={bgImgRef}
          src={HERO_CONFIG.backgroundImage}
          alt=""
          className="hero__bg-img"
          fetchPriority="high"
        />
        <div className="hero__bg-veil" />
      </div>

      <h1 className="hero__stage" aria-label="MARCELO">
        <span
          ref={leftWordRef}
          className="hero__word hero__word--left"
          aria-hidden="true"
        >
          {HERO_CONFIG.leftWord}
        </span>

        <span ref={cardRef} className="hero__photo-frame">
          <img
            ref={portraitRef}
            src={HERO_CONFIG.portraitImage}
            alt={HERO_CONFIG.portraitAlt}
            className="hero__photo-img"
            style={{ objectPosition: HERO_CONFIG.portraitObjectPosition }}
            fetchPriority="high"
          />
        </span>

        <span
          ref={rightWordRef}
          className="hero__word hero__word--right"
          aria-hidden="true"
        >
          {HERO_CONFIG.rightWord}
        </span>
      </h1>

      <div ref={footerRef} className="hero__footer">
        <div className="hero__scroll-cue" aria-hidden="true">
          <span>Role para iniciar</span>
          <span className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
}
