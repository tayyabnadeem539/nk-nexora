import { useEffect, useState } from 'react';

/**
 * Types text out character by character.
 * - `loop: false` → types a single string once (restarts when `text`/`enabled` change)
 * - `loop: true`  → cycles through an array of phrases, typing and deleting each
 */
export default function useTypewriter(text, {
  enabled = true,
  loop = false,
  typeSpeed = 50,
  deleteSpeed = 25,
  holdDelay = 2200,
  nextDelay = 450,
  respectReducedMotion = false
} = {}) {
  const [output, setOutput] = useState('');
  const key = Array.isArray(text) ? text.join('\u0000') : text;

  useEffect(() => {
    if (!enabled) return;
    const phrases = Array.isArray(text) ? text : [text];
    if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOutput(phrases[0]);
      return;
    }
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timeout;
    setOutput('');

    const tick = () => {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        setOutput(phrase.substring(0, charIdx));
        if (charIdx >= phrase.length) {
          if (!loop) return;
          deleting = true;
          timeout = setTimeout(tick, holdDelay);
          return;
        }
      } else {
        charIdx--;
        setOutput(phrase.substring(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          timeout = setTimeout(tick, nextDelay);
          return;
        }
      }
      timeout = setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
    };

    tick();
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, loop, typeSpeed, deleteSpeed, holdDelay, nextDelay, respectReducedMotion]);

  return output;
}
