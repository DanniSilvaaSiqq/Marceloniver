import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Hero from './components/Hero';
import StorySection from './components/StorySection';
import FinalMemories from './components/FinalMemories';
import MemoryIntro from './components/MemoryIntro';
import { AUDIO_CONFIG } from './config/experienceConfig';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  { id: 'hero', label: '01' },
  { id: 'story', label: '02' },
  { id: 'final', label: '03' },
];

export default function App() {
  const lenisRef = useRef(null);
  const audioRef = useRef(null);
  const fadeFrameRef = useRef(null);
  const userMutedRef = useRef(false);

  const [activeChapter, setActiveChapter] = useState('hero');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  const handleHeroReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroVisible(false);
    if (lenisRef.current) {
      lenisRef.current.start();
    }
    ScrollTrigger.refresh();
  }, []);

  const fadeAudioTo = useCallback((targetVol, durationMs, onComplete) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeFrameRef.current) {
      cancelAnimationFrame(fadeFrameRef.current);
    }

    const startVol = audio.volume;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      audio.volume = Math.max(
        0,
        Math.min(1, startVol + (targetVol - startVol) * progress)
      );

      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
        if (onComplete) onComplete();
      }
    };

    fadeFrameRef.current = requestAnimationFrame(step);
  }, []);

  const startAmbientAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || userMutedRef.current) return Promise.resolve(false);

    audio.volume = 0;
    return audio
      .play()
      .then(() => {
        setIsPlayingAudio(true);
        fadeAudioTo(AUDIO_CONFIG.targetVolume, AUDIO_CONFIG.fadeInMs);
        return true;
      })
      .catch(() => false);
  }, [fadeAudioTo]);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingAudio) {
      userMutedRef.current = true;
      setIsPlayingAudio(false);
      fadeAudioTo(0, AUDIO_CONFIG.fadeOutMs, () => {
        audio.pause();
      });
    } else {
      userMutedRef.current = false;
      startAmbientAudio();
    }
  }, [fadeAudioTo, isPlayingAudio, startAmbientAudio]);

  // Ambient nostalgic soundtrack: gentle autoplay + respectful first-gesture fallback
  useEffect(() => {
    const audio = new Audio(AUDIO_CONFIG.src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    audioRef.current = audio;

    let gestureListenersAttached = false;

    const handleFirstGesture = () => {
      if (userMutedRef.current) {
        removeGestureListeners();
        return;
      }
      startAmbientAudio().then((started) => {
        if (started) {
          removeGestureListeners();
        }
      });
    };

    const removeGestureListeners = () => {
      if (!gestureListenersAttached) return;
      gestureListenersAttached = false;
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    startAmbientAudio().then((started) => {
      if (!started && !userMutedRef.current) {
        gestureListenersAttached = true;
        window.addEventListener('pointerdown', handleFirstGesture, {
          passive: true,
        });
        window.addEventListener('keydown', handleFirstGesture, {
          passive: true,
        });
        window.addEventListener('touchstart', handleFirstGesture, {
          passive: true,
        });
      }
    });

    return () => {
      removeGestureListeners();
      if (fadeFrameRef.current) {
        cancelAnimationFrame(fadeFrameRef.current);
      }
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [startAmbientAudio]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let rafCallback = null;

    if (!prefersReducedMotion) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 1.35,
      });

      lenisRef.current = lenis;
      lenis.stop();
      lenis.on('scroll', ScrollTrigger.update);

      rafCallback = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // Track active chapter for minimal editorial navigation bar
    const triggers = CHAPTERS.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => setActiveChapter(id),
        onEnterBack: () => setActiveChapter(id),
      })
    );

    const handleLoadRefresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoadRefresh);

    return () => {
      window.removeEventListener('load', handleLoadRefresh);
      triggers.forEach((t) => t.kill());
      if (rafCallback) {
        gsap.ticker.remove(rafCallback);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.3 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Trava rolagem nativa enquanto a introdução cinematográfica estiver ativa
  useEffect(() => {
    if (introVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [introVisible]);

  return (
    <>
      {introVisible && (
        <MemoryIntro
          onReadyForHero={handleHeroReady}
          onComplete={handleIntroComplete}
        />
      )}

      <nav
        className={`editorial-nav ${activeChapter === 'final' ? 'editorial-nav--dark' : ''
          }`}
        aria-label="Navegação entre capítulos"
      >
        <a
          href="#hero"
          className="editorial-nav__brand"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
        >
          MARCELO
        </a>

        <div className="editorial-nav__controls">
          <ul className="editorial-nav__chapters">
            {CHAPTERS.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  className={`editorial-nav__link ${activeChapter === id ? 'editorial-nav__link--active' : ''
                    }`}
                  onClick={() => scrollToSection(id)}
                  aria-current={activeChapter === id ? 'step' : undefined}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={`editorial-nav__audio ${isPlayingAudio ? 'editorial-nav__audio--playing' : ''
              }`}
            onClick={toggleAudio}
            aria-pressed={isPlayingAudio}
            aria-label={
              isPlayingAudio
                ? 'Pausar música de fundo'
                : 'Tocar música de fundo'
            }
            title={AUDIO_CONFIG.title}
          >
            <span className="editorial-nav__bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="editorial-nav__audio-label">
              {isPlayingAudio ? 'SOM' : 'MUDO'}
            </span>
          </button>
        </div>
      </nav>

      <main>
        <Hero ready={heroReady} />
        <StorySection />
        <FinalMemories onScrollToTop={scrollToTop} />
      </main>
    </>
  );
}
