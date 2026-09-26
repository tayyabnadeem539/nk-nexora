import { useState } from 'react';
import { DRAWER_HUB_LINKS, DRAWER_TOOL_LINKS } from '../../constants/navigation.js';
import { useBookmarks } from '../../context/BookmarksContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { PinIcon, SearchIcon, UserIcon } from '../common/Icons.jsx';
import Breadcrumbs from './Breadcrumbs.jsx';

function DrawerLink({ link, active, bookmarkCount, onClick }) {
  let trailing = <span className="nav-arrow">&rarr;</span>;
  if (link.badge) {
    trailing = <span className="nav-badge-pill" style={{ borderColor: link.badge.borderColor, color: link.badge.color }}>{link.badge.text}</span>;
  } else if (link.bookmarkCount) {
    trailing = bookmarkCount > 0
      ? <span className="badge-count bookmark-badge-counter" style={{ display: 'flex', position: 'static' }}>{bookmarkCount}</span>
      : null;
  }

  return (
    <a href={`#${link.path}`} className={`mobile-nav-link ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="link-label"><span className="nav-link-icon">{link.icon}</span> {link.label}</span>
      {trailing}
    </a>
  );
}

export default function MobileDrawer({ activePath, breadcrumbs }) {
  const { mobileMenuOpen, closeMobileMenu, openAuthModal } = useUI();
  const { bookmarks } = useBookmarks();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    window.location.hash = 'search?q=' + encodeURIComponent(q);
    closeMobileMenu();
  };

  const renderLinks = (links) => links.map(link => (
    <DrawerLink key={link.path} link={link} active={activePath === link.path} bookmarkCount={bookmarks.length} onClick={closeMobileMenu} />
  ));

  return (
    <>
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu} />
      <aside className={`mobile-nav-drawer ${mobileMenuOpen ? 'active' : ''}`} aria-label="Mobile Navigation">
        <div className="mobile-drawer-header">
          <a href="#home" className="brand-logo" onClick={closeMobileMenu} aria-label="FandomVerse Home">
            <div className="brand-icon-box">★</div>
            <div className="brand-text-wrap">
              <span className="brand-title">FANDOM<span>VERSE</span></span>
            </div>
          </a>
          <button type="button" className="mobile-drawer-close-btn" aria-label="Close Menu" onClick={closeMobileMenu}>✕</button>
        </div>

        <div className="mobile-drawer-breadcrumbs-box">
          <div className="drawer-breadcrumbs-label">
            <PinIcon size={13} strokeWidth={2.5} />
            <span>Active Location (Breadcrumb Trail)</span>
          </div>
          <ul className="drawer-breadcrumb-trail">
            <Breadcrumbs trail={breadcrumbs} onNavigate={closeMobileMenu} />
          </ul>
        </div>

        <div className="mobile-drawer-search">
          <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="drawer-search-input"
              placeholder="Search across fandoms..."
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="drawer-search-btn" aria-label="Search">
              <SearchIcon size={15} />
            </button>
          </form>
        </div>

        <div className="mobile-drawer-scrollable">
          <div className="mobile-nav-group-title">Fandom Hubs</div>
          <div className="mobile-nav-links">{renderLinks(DRAWER_HUB_LINKS)}</div>

          <div className="mobile-nav-group-title" style={{ marginTop: 16 }}>Portal Media & Tools</div>
          <div className="mobile-nav-links">{renderLinks(DRAWER_TOOL_LINKS)}</div>
        </div>

        <div className="mobile-drawer-footer">
          <button
            type="button"
            className="btn-hero-primary"
            onClick={() => { openAuthModal('login'); closeMobileMenu(); }}
            style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}
          >
            <UserIcon size={16} />
            Sign In / Member Portal
          </button>
        </div>
      </aside>
    </>
  );
}
