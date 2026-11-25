import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import FloatingStars from './FloatingStars';
import { INTRO_CONFIG } from '../config/experienceConfig';

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

export default function MemoryIntro({ onReadyForHero, onComplete }) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const photoRefs = useRef([]);
  const exitStartedRef = useRef(false);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let cancelled = false;
    let assetsReady = false;
    let albumComposed = false;
    let holdTimer = null;

    // Pré-carregamento real das imagens essenciais e do álbum, com timeout seguro
    const urlsToPreload = [
      ...INTRO_CONFIG.essentialPreload,
      ...INTRO_CONFIG.photos.map((p) => p.src),
    ];

    const preloadPromise = Promise.allSettled(
      urlsToPreload.map((src) => preloadImage(src))
    );
    const safetyTimeout = new Promise((resolve) =>
      setTimeout(resolve, INTRO_CONFIG.preloadTimeoutMs)
    );

    const tryExit = () => {
      if (cancelled || exitStartedRef.current || !assetsReady || !albumComposed) {
        return;
      }
      exitStartedRef.current = true;

      if (prefersReducedMotion) {
        if (onReadyForHero) onReadyForHero();
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
          onComplete: () => {
            if (!cancelled && onComplete) onComplete();
          },
        });
        return;
      }

      // Transição cinematográfica:
      // 1. Fotografias do álbum se afastam suavemente
      // 2. O nome MARCELO permanece em destaque por um instante
      // 3. A tela se dissolve suavemente enquanto a Hero inicia sua entrada
      const exitTl = gsap.timeline();
      const activePhotos = photoRefs.current.filter(Boolean);

      exitTl.to(
        eyebrowRef.current,
        {
          opacity: 0,
          y: -10,
          duration: 0.45,
          ease: 'power2.in',
        },
        0
      );

      activePhotos.forEach((el, idx) => {
        const cfg = INTRO_CONFIG.photos[idx];
        const disperseX = (cfg?.from?.x || 0) * 0.48;
        const disperseY = (cfg?.from?.y || 0) * 0.48;
        exitTl.to(
          el,
          {
            x: disperseX,
            y: disperseY,
            scale: 0.92,
            opacity: 0,
            duration: 0.72,
            ease: 'power3.inOut',
          },
          0.04 + idx * 0.025
        );
      });

      exitTl.to(
        titleRef.current,
        {
          scale: 1.035,
          letterSpacing: '0.18em',
          duration: 0.72,
          ease: 'power2.out',
        },
        0.22
      );

      exitTl.add(() => {
        if (!cancelled && onReadyForHero) onReadyForHero();
      }, 0.72);

      exitTl.to(
        rootRef.current,
        {
          opacity: 0,
          duration: 0.85,
          ease: 'power2.inOut',
          onComplete: () => {
            if (!cancelled && onComplete) onComplete();
          },
        },
        0.68
      );
    };

    Promise.race([preloadPromise, safetyTimeout]).then(() => {
      assetsReady = true;
      tryExit();
    });

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([eyebrowRef.current, titleRef.current], {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        INTRO_CONFIG.photos.forEach((photo, idx) => {
          const el = photoRefs.current[idx];
          if (el) {
            gsap.set(el, {
              opacity: 0.92,
              scale: 1,
              x: 0,
              y: 0,
              rotation: photo.rotation,
            });
          }
        });
        holdTimer = setTimeout(() => {
          albumComposed = true;
          tryExit();
        }, 1050);
        return;
      }

      const introTl = gsap.timeline({
        onComplete: () => {
          holdTimer = setTimeout(() => {
            albumComposed = true;
            tryExit();
          }, INTRO_CONFIG.minHoldAfterAlbumMs);
        },
      });

      // Abertura editorial: MARCELO surge no centro como âncora visual
      introTl
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 0.65, y: 0, duration: 0.75, ease: 'power2.out' },
          0.1
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 20, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.05,
            ease: 'power3.out',
          },
          0.15
        );

      // Montagem progressiva do álbum físico ao redor do nome MARCELO
      const offsetScale = isMobile ? 0.52 : 1;

      INTRO_CONFIG.photos.forEach((photo, idx) => {
        const el = photoRefs.current[idx];
        if (!el) return;

        introTl.fromTo(
          el,
          {
            opacity: 0,
            x: photo.from.x * offsetScale,
            y: photo.from.y * offsetScale,
            scale: photo.from.scale,
            rotation: photo.from.rotation,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: photo.rotation,
            duration: photo.duration,
            ease: 'power3.out',
          },
          photo.delay
        );
      });
    }, rootRef);

    return () => {
      cancelled = true;
      if (holdTimer) clearTimeout(holdTimer);
      ctx.revert();
    };
  }, [isMobile, onComplete, onReadyForHero]);

  return (
    <div
      ref={rootRef}
      className="memory-intro"
      role="status"
      aria-label="Abertura do álbum de memórias de Marcelo"
    >
      <div className="memory-intro__grain" aria-hidden="true" />
      <div className="memory-intro__vignette" aria-hidden="true" />

      <FloatingStars
        className="memory-intro__stars"
        desktopCount={46}
        mobileCount={24}
      />

      <div className="memory-intro__album" aria-hidden="true">
        {INTRO_CONFIG.photos.map((photo, idx) => {
          const layout = isMobile ? photo.mobile : photo.desktop;
          return (
            <figure
              key={photo.id}
              ref={(el) => {
                photoRefs.current[idx] = el;
              }}
              className={`memory-intro__photo ${
                photo.framed
                  ? 'memory-intro__photo--framed'
                  : 'memory-intro__photo--borderless'
              }`}
              style={{
                top: layout.top,
                right: layout.right,
                bottom: layout.bottom,
                left: layout.left,
                width: layout.width,
                aspectRatio: layout.aspectRatio,
                zIndex: photo.zIndex,
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="memory-intro__img"
                decoding="async"
                onError={(e) => {
                  // Evita molduras quebradas caso alguma foto falhe
                  e.currentTarget.closest('.memory-intro__photo').style.display =
                    'none';
                }}
              />
            </figure>
          );
        })}
      </div>

      <div className="memory-intro__center">
        <span ref={eyebrowRef} className="memory-intro__eyebrow">
          {INTRO_CONFIG.eyebrow}
        </span>
        <span ref={titleRef} className="memory-intro__title">
          {INTRO_CONFIG.title}
        </span>
      </div>
    </div>
  );
}
