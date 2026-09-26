/**
 * FandomVerse - Hash-Based Single Page Application (SPA) Router
 * Handles seamless client-side navigation, active link states, dynamic breadcrumbs, and scroll restoration.
 */

const Router = {
  routes: {
    '': () => UI.renderHome(),
    'home': () => UI.renderHome(),
    'anime': () => UI.renderCategory('anime'),
    'gaming': () => UI.renderCategory('gaming'),
    'movies': () => UI.renderCategory('movies'),
    'tv-shows': () => UI.renderCategory('tv-shows'),
    'k-pop': () => UI.renderCategory('k-pop'),
    'kpop': () => UI.renderCategory('k-pop'),
    'comics': () => UI.renderCategory('comics'),
    'manga': () => UI.renderCategory('manga'),
    'trailers': () => UI.renderTrailers(),
    'events': () => UI.renderEvents(),
    'merch': () => UI.renderMerchandise(),
    'bookmarks': () => UI.renderBookmarks(),
    'about': () => UI.renderAbout(),
    'contact': () => UI.renderContact(),
    'search': (param) => UI.renderSearch(param)
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();
  },

  handleRouting() {
    // Close any open modals and mobile menu
    UI.closeAllModals();
    this.closeMobileMenu();

    let rawHash = window.location.hash.slice(1).trim();
    if (!rawHash) rawHash = 'home';

    // Parse route and optional parameters (e.g. search?q=one+piece)
    let [path, queryString] = rawHash.split('?');
    let searchParam = '';

    if (queryString) {
      const params = new URLSearchParams(queryString);
      searchParam = params.get('q') || '';
    }

    // Direct modal deep link handlers (e.g. #article/art-anime-1)
    if (path.startsWith('article/')) {
      const artId = path.split('/')[1];
      UI.renderHome();
      setTimeout(() => UI.openArticleModal(artId), 150);
      this.updateBreadcrumbs(['Home', 'Articles', artId]);
      return;
    }

    if (path.startsWith('character/')) {
      const charId = path.split('/')[1];
      UI.renderHome();
      setTimeout(() => UI.openCharacterModal(charId), 150);
      this.updateBreadcrumbs(['Home', 'Characters', charId]);
      return;
    }

    // Standard Route Handling
    const handler = this.routes[path];
    if (handler) {
      handler(searchParam);
      this.updateActiveNavLinks(path);
      this.updateBreadcrumbsForRoute(path, searchParam);
    } else {
      UI.renderNotFound();
      this.updateBreadcrumbs(['Home', '404 Not Found']);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Animate newly-rendered content into view
    if (window.UI && typeof UI.initScrollReveal === 'function') {
      requestAnimationFrame(() => UI.initScrollReveal());
    }
  },

  updateActiveNavLinks(activePath) {
    document.querySelectorAll('.nav-link-item, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      const isMatch = (href === activePath) || (!href && activePath === 'home');
      link.classList.toggle('active', isMatch);
    });
  },

  updateBreadcrumbsForRoute(path, searchParam = '') {
    const breadcrumbTrail = ['Home'];

    const categoryNames = {
      'anime': 'Anime Hub',
      'gaming': 'Gaming Hub',
      'movies': 'Movies Hub',
      'tv-shows': 'TV Shows Hub',
      'k-pop': 'K-Pop Hub',
      'kpop': 'K-Pop Hub',
      'comics': 'Comics Hub',
      'manga': 'Manga Hub'
    };

    if (categoryNames[path]) {
      breadcrumbTrail.push(categoryNames[path]);
    } else if (path === 'trailers') {
      breadcrumbTrail.push('Trailers & Media');
    } else if (path === 'events') {
      breadcrumbTrail.push('Events Calendar');
    } else if (path === 'merch') {
      breadcrumbTrail.push('Official Merchandise');
    } else if (path === 'bookmarks') {
      breadcrumbTrail.push('Saved Bookmarks');
    } else if (path === 'search') {
      breadcrumbTrail.push(searchParam ? `Search: "${searchParam}"` : 'Global Search');
    } else if (path === 'about') {
      breadcrumbTrail.push('About Us');
    } else if (path === 'contact') {
      breadcrumbTrail.push('Contact Us');
    }

    this.updateBreadcrumbs(breadcrumbTrail);
  },

  updateBreadcrumbs(trail) {
    const el = document.getElementById('globalBreadcrumbsList');
    const drawerEl = document.getElementById('mobileDrawerBreadcrumbsList');

    const getCrumbLink = (crumb) => {
      const c = crumb.toLowerCase();
      if (c === 'home') return '#home';
      if (c.includes('anime')) return '#anime';
      if (c.includes('gaming')) return '#gaming';
      if (c.includes('movies')) return '#movies';
      if (c.includes('tv shows')) return '#tv-shows';
      if (c.includes('k-pop') || c.includes('kpop')) return '#k-pop';
      if (c.includes('comics')) return '#comics';
      if (c.includes('manga')) return '#manga';
      if (c.includes('trailers')) return '#trailers';
      if (c.includes('events')) return '#events';
      if (c.includes('merch')) return '#merch';
      if (c.includes('bookmarks')) return '#bookmarks';
      if (c.includes('search')) return '#search';
      if (c.includes('about')) return '#about';
      if (c.includes('contact')) return '#contact';
      return '#home';
    };

    const renderCrumbs = (isDrawer = false) => {
      if (trail.length <= 1) {
        return `
          <li class="breadcrumb-item"><a href="#home"${isDrawer ? ' onclick="Router.closeMobileMenu()"' : ''}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> Home</a></li>
          <span class="breadcrumb-separator">/</span>
          <li class="breadcrumb-item active">Portal Central</li>
        `;
      }

      return trail.map((crumb, idx) => {
        const isLast = idx === trail.length - 1;
        if (isLast) {
          return `<li class="breadcrumb-item active">${crumb}</li>`;
        } else {
          const link = getCrumbLink(crumb);
          return `
            <li class="breadcrumb-item"><a href="${link}"${isDrawer ? ' onclick="Router.closeMobileMenu()"' : ''}>${crumb}</a></li>
            <span class="breadcrumb-separator">/</span>
          `;
        }
      }).join('');
    };

    if (el) el.innerHTML = renderCrumbs(false);
    if (drawerEl) drawerEl.innerHTML = renderCrumbs(true);
  },

  closeMobileMenu() {
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileNavOverlay');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }
};

window.Router = Router;
