/* A single toast notification with an auto-dismiss timer that pauses on hover. */
import { useCallback, useEffect, useRef, useState } from 'react';

const ICONS = {
  success: <polyline points="20 6 9 17 4 12" />,
  info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  warning: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  error: <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
};

const EXIT_MS = 280;

export default function Toast({ toast, onDismiss }) {
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.duration);
  const startedAt = useRef(0);

  const close = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), EXIT_MS);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    if (paused || leaving) return;
    startedAt.current = Date.now();
    const t = setTimeout(close, remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, leaving, close]);

  return (
    <div
      className={`fv-toast fv-toast-${toast.type} ${leaving ? 'is-leaving' : ''}`}
      role={toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="fv-toast-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {ICONS[toast.type] || ICONS.info}
        </svg>
      </div>
      <div className="fv-toast-body">
        {toast.title && <div className="fv-toast-title">{toast.title}</div>}
        {toast.message && <div className="fv-toast-message">{toast.message}</div>}
      </div>
      <button type="button" className="fv-toast-close" onClick={close} aria-label="Dismiss notification">✕</button>
      <span
        className="fv-toast-progress"
        style={{ animationDuration: `${toast.duration}ms`, animationPlayState: paused ? 'paused' : 'running' }}
      />
    </div>
  );
}
