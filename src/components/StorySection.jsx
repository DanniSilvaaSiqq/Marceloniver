import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PhotoStream from './PhotoStream';
import { STORY_CONTENT } from '../config/storyText';

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const sectionRef = useRef(null);
  const honorRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const revealEls = gsap.utils.toArray('.story-reveal');

      revealEls.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.12, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 87%',
              once: true,
            },
          }
        );
      });

      // Entrada cinematográfica sutil para a frase de encerramento
      if (honorRef.current) {
        gsap.fromTo(
          honorRef.current,
          { opacity: 0, y: 28, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.35,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: honorRef.current,
              start: 'top 84%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="story-section"
      aria-label="Capítulo 02 — Nossa História"
    >
      <PhotoStream />

      <article className="story-content">
        <header className="story-header">
          <div className="story-meta story-reveal">
            <span>{STORY_CONTENT.chapterNumber}</span>
            <span className="story-meta__rule" aria-hidden="true" />
            <span>{STORY_CONTENT.chapterLabel}</span>
          </div>

          <h2 className="story-salutation story-reveal">
            {STORY_CONTENT.salutation}
          </h2>

          <p className="story-opening story-reveal">{STORY_CONTENT.opening}</p>
        </header>

        <div className="story-flow">
          {STORY_CONTENT.passages.map((passage) => (
            <div key={passage.id} className="story-passage">
              {passage.marker && (
                <div className="story-marker story-reveal" aria-hidden="true">
                  <span className="story-marker__line" />
                  <span className="story-marker__label">{passage.marker}</span>
                  <span className="story-marker__line" />
                </div>
              )}

              {passage.pause && (
                <div className="story-pause story-reveal" aria-hidden="true">
                  <span className="story-pause__rule" />
                </div>
              )}

              <div className="story-passage__body">
                {passage.paragraphs.map((item, idx) => {
                  const isObj = typeof item === 'object';
                  const text = isObj ? item.text : item;
                  const emphasis = isObj ? item.emphasis : null;

                  return (
                    <p
                      key={`${passage.id}-${idx}`}
                      className={`story-paragraph story-reveal ${
                        emphasis === 'reflective'
                          ? 'story-paragraph--reflective'
                          : ''
                      }`}
                    >
                      {text}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <footer className="story-closing">
          <div className="story-pause story-reveal" aria-hidden="true">
            <span className="story-pause__rule" />
          </div>

          <p className="story-closing__wish story-reveal">
            {STORY_CONTENT.closing.wish}
          </p>

          <p ref={honorRef} className="story-closing__honor">
            {STORY_CONTENT.closing.honor}
          </p>
        </footer>
      </article>
    </section>
  );
}
