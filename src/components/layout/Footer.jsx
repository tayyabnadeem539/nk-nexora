import { Link } from 'react-router-dom';
import { FOOTER_HUB_LINKS } from '../../constants/navigation.js';
import { pathFor } from '../../routes/paths.js';
import { useUI } from '../../context/UIContext.jsx';
import { exportBookmarks } from '../../services/bookmarkExport.js';

const TECH_TAGS = ['React + Vite', 'ES6+ SPA', 'LocalStorage', 'SessionStorage', 'Zero Backend'];
const PORTAL_STATS = [
  '60+ In-Depth Articles', '42 Character Dossiers', '42 Video Trailers & Media',
  '24 Global Conventions', '14 Licensed Collectibles', '16 Upcoming Releases'
];

/** Link that runs an action instead of navigating. */
const ActionLink = ({ onClick, children }) => (
  <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }}>{children}</a>
);

export default function Footer() {
  const { toggleChat } = useUI();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          <div className="footer-brand-column">
            <div className="brand-logo" style={{ marginBottom: 4 }}>
              <div className="brand-icon-box" style={{ width: 32, height: 32, fontSize: 16 }}>★</div>
              <span className="brand-title" style={{ fontSize: 18 }}>FANDOM<span>VERSE</span></span>
            </div>
            <p className="footer-description">
              The definitive centralized entertainment and fandom discovery portal. Uniting fans of Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga into one comprehensive, high-density discovery experience.
            </p>
            <div className="footer-tech-pills">
              {TECH_TAGS.map(tag => <span key={tag} className="tech-tag">{tag}</span>)}
            </div>
          </div>

          <div>
            <div className="footer-col-title">Fandom Hubs</div>
            <ul className="footer-links-list">
              {FOOTER_HUB_LINKS.map(([path, label]) => <li key={path}><Link to={pathFor(path)}>{label}</Link></li>)}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Explore & Tools</div>
            <ul className="footer-links-list">
              <li><Link to={pathFor('trailers')}>Trailers & Media Hub</Link></li>
              <li><Link to={pathFor('events')}>Conventions & Events</Link></li>
              <li><Link to={pathFor('merch')}>Merchandise Store</Link></li>
              <li><Link to={pathFor('bookmarks')}>Saved Bookmarks</Link></li>
              <li><Link to={pathFor('search')}>Global Search Engine</Link></li>
              <li><ActionLink onClick={toggleChat}>Fandom Guide Assistant</ActionLink></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">TechWiz 7</div>
            <ul className="footer-links-list">
              <li><Link to={pathFor('about')}>Project Overview</Link></li>
              <li><Link to={pathFor('about')}>SRS Compliance v1.0</Link></li>
              <li><Link to={pathFor('contact')}>Team Contact</Link></li>
              <li><Link to={pathFor('about')}>Aptech Limited</Link></li>
              <li><ActionLink onClick={exportBookmarks}>Export Data (.md)</ActionLink></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Portal Stats</div>
            <ul className="footer-links-list" style={{ fontSize: 13 }}>
              {PORTAL_STATS.map(stat => <li key={stat}>{stat}</li>)}
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-bottom-flex">
            <div>&copy; 2026 FandomVerse Portal • All right reserved.</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link to={pathFor('home')}>Home</Link>
              <Link to={pathFor('about')}>About</Link>
              <Link to={pathFor('contact')}>Contact</Link>
              <Link to={pathFor('search')}>Search</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
