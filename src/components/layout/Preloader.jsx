/* Site preloader: letter-in logo, eased progress bar, curtain-wipe exit. */
import { useEffect, useState } from 'react';

const WORD = 'FANDOMVERSE';
const ACCENT_START = 6; // "VERSE" starts here

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let current = 0;
    let done = false;
    const timeouts = [];

    // Ease progress up to 90% while waiting on the real page load, then snap to 100%
    const ticker = setInterval(() => {
      const remaining = 90 - current;
      current = Math.min(current + Math.max(remaining * 0.12, 0.6), 100);
      setProgress(current);
      if (current >= 89.5) clearInterval(ticker);
    }, 90);

    const hide = () => {
      if (done) return;
      done = true;
      clearInterval(ticker);
      setProgress(100);
      timeouts.push(setTimeout(() => {
        setHidden(true);
        timeouts.push(setTimeout(() => setRemoved(true), 900));
      }, 220));
    };

    const minDelay = new Promise(res => timeouts.push(setTimeout(res, 1100)));
    const pageReady = new Promise(res => {
      if (document.readyState === 'complete') res();
      else window.addEventListener('load', res, { once: true });
    });
    Promise.all([minDelay, pageReady]).then(hide);
    timeouts.push(setTimeout(hide, 4500)); // safety net

    return () => {
      done = true;
      clearInterval(ticker);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  if (removed) return null;

  return (
    <div className={`site-preloader ${hidden ? 'is-hidden' : ''}`}>
      <div className="preloader-inner">
        <div className="preloader-mark">★</div>
        <div className="preloader-logo">
          {WORD.split('').map((ch, i) => (
            <span key={i} className={`pl-char${i >= ACCENT_START ? ' pl-accent' : ''}`} style={{ '--i': i }}>{ch}</span>
          ))}
        </div>
        <div className="preloader-track">
          <div className="preloader-bar">
            <div className="preloader-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="preloader-meta-row">
            <span>Initializing Portal</span>
            <span className="preloader-percent">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
