import { useEffect } from 'react';

const SELECTOR = [
  '.content-section',
  '.grid-2 > *',
  '.grid-3 > *',
  '.grid-4 > *',
  '.grid-6 > *',
  '.scroll-strip > *'
].map(s => `#viewContainer ${s}:not(.reveal-init)`).join(', ');

let observer = null;
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  return observer;
}

function revealNewTargets() {
  const targets = document.querySelectorAll(SELECTOR);
  targets.forEach((el, idx) => {
    el.classList.add('reveal-init', 'reveal-up');
    el.style.setProperty('--reveal-delay', `${Math.min(idx % 6, 5) * 70}ms`);
    getObserver().observe(el);
  });
}

/**
 * Scroll-triggered reveal animations. Watches #viewContainer for newly
 * rendered cards/sections (route changes, tab switches, filters) and
 * animates them into view.
 */
export default function useScrollReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const container = document.getElementById('viewContainer');
    if (!container) return;

    revealNewTargets();
    let raf = null;
    const mo = new MutationObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        revealNewTargets();
      });
    });
    mo.observe(container, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
