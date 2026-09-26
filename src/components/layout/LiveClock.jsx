import { useEffect, useState } from 'react';

const CLOCK_OPTIONS = {
  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
};

/** Real-time clock that ticks every second. */
export default function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="real-time-clock">
      <span className="clock-live-dot" title="Live clock" />
      <span>{now.toLocaleString('en-US', CLOCK_OPTIONS)}</span>
    </div>
  );
}
