/**
 * Cinematic hero slider — 3D tilt transition, 4s auto-play (paused on hover),
 * swipe support, dots + arrows, and local trailer players.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_SLIDES } from '../../constants/homeContent.js';
import { pad2 } from '../../utils/format.js';
import { ChevronLeft, ChevronRight } from '../common/Icons.jsx';
import HeroSlide from './HeroSlide.jsx';

const AUTOPLAY_MS = 4000;
const TRANSITION_CLASSES = ['leaving', 'pre-enter', 'dir-next', 'dir-prev', 'active'];

export default function HeroSlider({ slides = HERO_SLIDES }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoKey, setVideoKey] = useState(0);
  const activeRef = useRef(0);
  const slideRefs = useRef([]);
  const videoRefs = useRef([]);
  const timerRef = useRef(null);
  const cleanupRef = useRef(null);
  const touchRef = useRef({ startX: 0, tracking: false });

  const switchTo = useCallback((index, direction) => {
    const prevIndex = activeRef.current;
    if (index === prevIndex) return;
    const els = slideRefs.current;
    const count = slides.length;
    if (!direction) {
      const forwardDist = (index - prevIndex + count) % count;
      direction = forwardDist <= count / 2 ? 'next' : 'prev';
    }
    const incoming = els[index];
    const outgoing = els[prevIndex];
    const dirClass = direction === 'next' ? 'dir-next' : 'dir-prev';
    activeRef.current = index;

    els.forEach(s => s && s.classList.remove(...TRANSITION_CLASSES));
    incoming.classList.add('pre-enter', dirClass);
    outgoing.classList.add('leaving', dirClass);
    void incoming.offsetWidth; // commit the pre-enter position before animating

    const enter = () => {
      if (activeRef.current !== index) return;
      incoming.classList.remove('pre-enter');
      incoming.classList.add('active');
    };
    requestAnimationFrame(() => requestAnimationFrame(enter));
    setTimeout(enter, 80); // fallback when rAF is throttled (background tab)

    clearTimeout(cleanupRef.current);
    cleanupRef.current = setTimeout(() => {
      els.forEach(s => { if (s && s !== incoming) s.classList.remove('leaving', 'dir-next', 'dir-prev'); });
    }, 950);

    setActiveIndex(index);
    setVideoKey(k => k + 1); // re-mount trailer players so playback stops
  }, [slides.length]);

  const pauseTimer = useCallback(() => clearInterval(timerRef.current), []);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => switchTo((activeRef.current + 1) % slides.length), AUTOPLAY_MS);
  }, [switchTo, slides.length]);

  const shift = useCallback((delta) => {
    switchTo((activeRef.current + delta + slides.length) % slides.length, delta > 0 ? 'next' : 'prev');
    startTimer();
  }, [switchTo, startTimer, slides.length]);

  useEffect(() => {
    startTimer();
    return () => {
      pauseTimer();
      clearTimeout(cleanupRef.current);
    };
  }, [startTimer, pauseTimer]);

  const playTrailer = (idx, fullscreen) => {
    pauseTimer();
    const video = videoRefs.current[idx];
    if (!video) return;
    video.muted = false;
    if (fullscreen && video.requestFullscreen) video.requestFullscreen().catch(() => {});
    video.play().catch(() => {});
  };

  const onTouchStart = (e) => { touchRef.current = { startX: e.touches[0].clientX, tracking: true }; };
  const onTouchEnd = (e) => {
    if (!touchRef.current.tracking) return;
    touchRef.current.tracking = false;
    const deltaX = e.changedTouches[0].clientX - touchRef.current.startX;
    if (Math.abs(deltaX) >= 45) shift(deltaX < 0 ? 1 : -1);
  };

  return (
    <section
      className="hero-cinematic-wrap"
      id="homeHeroSlider"
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, idx) => (
        <HeroSlide
          key={idx}
          ref={el => { slideRefs.current[idx] = el; }}
          slide={slide}
          index={idx}
          active={idx === activeIndex}
          videoKey={videoKey}
          videoRef={el => { videoRefs.current[idx] = el; }}
          onPlay={(fullscreen) => playTrailer(idx, fullscreen)}
        />
      ))}

      <button type="button" className="hero-arrow-btn hero-arrow-prev" onClick={() => shift(-1)} aria-label="Previous slide">
        <ChevronLeft />
      </button>
      <button type="button" className="hero-arrow-btn hero-arrow-next" onClick={() => shift(1)} aria-label="Next slide">
        <ChevronRight size={20} />
      </button>

      <div className="hero-control-bar">
        <span className="hero-slide-counter">
          <span className="current">{pad2(activeIndex + 1)}</span> / {pad2(slides.length)}
        </span>
        <div className="hero-slider-nav">
          {slides.map((_, idx) => (
            <div key={idx} className={`hero-dot ${idx === activeIndex ? 'active' : ''}`} onClick={() => switchTo(idx)}>
              <span className="hero-dot-progress" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
