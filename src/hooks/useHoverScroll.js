import { useEffect } from 'react';

/**
 * Auto-scrolls a horizontally overflowing element toward whichever edge the
 * mouse hovers near (right half → scroll right, left half → scroll left).
 */
export default function useHoverScroll(ref, { maxSpeed = 5, deadZone = 0.12 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId = null;
    let speed = 0;

    const step = () => {
      if (speed !== 0) el.scrollLeft += speed;
      rafId = requestAnimationFrame(step);
    };
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;
      const half = rect.width / 2;
      const offset = (e.clientX - rect.left - half) / half; // -1 .. 1
      speed = Math.abs(offset) < deadZone ? 0 : offset * maxSpeed;
    };
    const onEnter = () => { if (!rafId) rafId = requestAnimationFrame(step); };
    const onLeave = () => {
      speed = 0;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      onLeave();
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, maxSpeed, deadZone]);
}
