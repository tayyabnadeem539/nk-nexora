import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/navigation.js';
import { useBookmarks } from '../../context/BookmarksContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { pathFor, PATHS } from '../../routes/paths.js';
import { notify } from '../../services/notificationService.js';
import { BookmarkIcon, CartIcon, MenuIcon } from '../common/Icons.jsx';
import HeaderSearch from './HeaderSearch.jsx';
import LiveClock from './LiveClock.jsx';

export default function Header() {
  const { bookmarks } = useBookmarks();
  const { totals, openCart } = useCart();
  const { loggedIn, openMobileMenu } = useUI();

  const showMemberInfo = () => notify({
    type: 'info',
    title: 'Demo Member Account',
    message: 'Signed in as FanExplorer2026. Authentication is demonstration-only.'
  });

  return (
    <header className="site-header">
      {/* Top utility bar: real-time clock */}
      <div className="header-top-bar">
        <div className="container header-top-content">
          <LiveClock />
          <div className="header-top-right" />
        </div>
      </div>

      {/* Main header row */}
      <div className="container">
        <div className="header-main-row">
          <Link to={PATHS.home} className="brand-logo" aria-label="FandomVerse Home">
            <div className="brand-icon-box">★</div>
            <div className="brand-text-wrap">
              <span className="brand-title">FANDOM<span>VERSE</span></span>
            </div>
          </Link>

          <HeaderSearch />

          <div className="header-actions">
            <Link to={PATHS.bookmarks} className="action-btn" title="Saved Bookmarks" aria-label="Bookmarks">
              <BookmarkIcon size={18} />
              {bookmarks.length > 0 && <span className="badge-count bookmark-badge-counter" style={{ display: 'flex' }}>{bookmarks.length}</span>}
            </Link>

            <button type="button" className="action-btn" onClick={openCart} title="Merchandise Demo Cart" aria-label="Shopping Cart">
              <CartIcon />
              {totals.count > 0 && <span className="badge-count cart-badge-counter" style={{ display: 'flex' }}>{totals.count}</span>}
            </button>

            {/* Sign-in lives in the mobile drawer; the badge appears once signed in */}
            {loggedIn && (
              <div className="user-profile-badge" style={{ display: 'flex' }} onClick={showMemberInfo}>
                <div className="user-avatar-mini">FE</div>
                <span className="user-profile-name" style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>FanExplorer</span>
              </div>
            )}

            <button type="button" className="mobile-menu-toggle" aria-label="Open Menu" onClick={openMobileMenu}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Primary categories navigation */}
      <nav className="header-nav-bar" aria-label="Primary Categories">
        <div className="container">
          <ul className="nav-links-list">
            {NAV_LINKS.map(([path, label]) => (
              <li key={path}>
                <NavLink to={pathFor(path)} end={path === 'home'} className="nav-link-item">{label}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
