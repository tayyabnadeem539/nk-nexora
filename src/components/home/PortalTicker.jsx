import { TICKER_PHRASES } from '../../constants/homeContent.js';
import useTypewriter from '../../hooks/useTypewriter.js';

/** "Portal Transmission" bar with looping typed headlines. */
export default function PortalTicker() {
  const text = useTypewriter(TICKER_PHRASES, { loop: true });

  return (
    <div className="live-portal-ticker-bar">
      <div className="container">
        <div className="ticker-inner">
          <div className="ticker-badge">
            <span className="ticker-live-dot" />
            <span className="ticker-badge-text">PORTAL TRANSMISSION</span>
          </div>
          <div className="ticker-stream">
            <span className="ticker-prefix">Now Trending:</span>
            <span className="ticker-typed-text">{text}</span>
            <span className="ticker-cursor-beam">|</span>
          </div>
          <div className="ticker-meta-pill">
            <span className="sparkle-symbol"></span> 7 Fandom Dimensions Active
          </div>
        </div>
      </div>
    </div>
  );
}
