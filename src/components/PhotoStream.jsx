import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { STORY_PHOTOS } from '../config/experienceConfig';

export default function PhotoStream() {
  const containerRef = useRef(null);
  const trackRefs = useRef([]);
  const itemRefs = useRef([]);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  // Track horizontal viewport width (debounced) to keep trajectories seamless
  useEffect(() => {
    let timer;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setViewportWidth(window.innerWidth);
      }, 220);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const sizeMultiplier =
    viewportWidth < 520 ? 0.52 : viewportWidth < 900 ? 0.72 : 1;

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      STORY_PHOTOS.forEach((photo, index) => {
        const trackEl = trackRefs.current[index];
        const itemEl = itemRefs.current[index];
        if (!trackEl || !itemEl) return;

        const scaledWidth = Math.round(photo.width * sizeMultiplier);
        const startX = viewportWidth + 120;
        const endX = -(scaledWidth + 160);

        // Apply individual rotation and depth scale to the inner photograph
        gsap.set(itemEl, {
          rotation: photo.rotation,
          scale: photo.scale,
        });

        if (prefersReducedMotion) {
          // Respect reduced motion: distribute photographs gracefully across viewport
          const staticX =
            endX + (startX - endX) * (1 - photo.initialProgress);
          gsap.set(trackEl, { x: staticX });
          return;
        }

        // Continuous independent right-to-left horizontal trajectory
        const horizontalTween = gsap.fromTo(
          trackEl,
          { x: startX },
          {
            x: endX,
            duration: photo.duration,
            ease: 'none',
            repeat: -1,
          }
        );

        // Seed at unique initial progress so the canvas is alive immediately
        horizontalTween.progress(photo.initialProgress);

        // Gentle independent vertical oscillation
        gsap.fromTo(
          itemEl,
          { y: -photo.bobAmplitude * 0.5 },
          {
            y: photo.bobAmplitude * 0.5,
            duration: photo.bobDuration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [viewportWidth, sizeMultiplier]);

  return (
    <div
      ref={containerRef}
      className="photo-stream"
      aria-hidden="true"
    >
      {STORY_PHOTOS.map((photo, index) => {
        const scaledWidth = Math.round(photo.width * sizeMultiplier);
        const scaledHeight = Math.round(photo.height * sizeMultiplier);

        return (
          <div
            key={photo.id}
            ref={(el) => {
              trackRefs.current[index] = el;
            }}
            className="photo-stream__track"
            style={{ top: photo.top }}
          >
            <figure
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={`photo-stream__item photo-stream__item--${photo.layer}`}
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="photo-stream__img"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        );
      })}
    </div>
  );
}
