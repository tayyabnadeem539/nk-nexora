/**
 * FandomVerse - Application Bootstrap & Core Utilities
 * SRS & Prompt Features:
 * - Real-Time Clock with seconds ticker
 * - Simulated Visitor Counter using LocalStorage
 * - Global Shortcuts (Ctrl+K, Escape)
 * - Header Search Instant Dropdown
 * - Mobile Menu Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.initClock();
    this.initVisitorCounter();
    this.initSearchShortcut();
    this.initKeyboardListeners();
    this.initHeaderSearchDropdown();
    this.initMobileMenu();
    this.initBreadcrumbToggle();

    // Initialize subsystems
    if (window.Bookmarks) window.Bookmarks.updateBadges();
    if (window.Cart) window.Cart.updateBadges();
    if (window.UI) window.UI.init();
    if (window.Router) window.Router.init();
  },

  // 1. Real-Time Clock (Updates every second)
  initClock() {
    const clockEl = document.getElementById('realTimeClockDisplay');
    if (!clockEl) return;

    const updateClock = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      clockEl.textContent = now.toLocaleString('en-US', options);
    };

    updateClock();
    setInterval(updateClock, 1000);
  },

  // 2. Simulated Visitor Counter (LocalStorage)
  initVisitorCounter() {
    const counterEl = document.getElementById('visitorCounterDisplay');
    if (!counterEl) return;

    const STORAGE_KEY = 'fandomverse_visitor_count';
    let count = parseInt(localStorage.getItem(STORAGE_KEY) || '1428', 10);

    // Increment simulated count once per session
    if (!sessionStorage.getItem('fandomverse_visited_session')) {
      count += 1;
      localStorage.setItem(STORAGE_KEY, count.toString());
      sessionStorage.setItem('fandomverse_visited_session', 'true');
    }

    // Format with leading zeros
    counterEl.textContent = count.toLocaleString('en-US').padStart(7, '0');
  },

  // 3. Search Shortcut (Ctrl+K or Cmd+K)
  initSearchShortcut() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const headerSearch = document.getElementById('headerSearchInput');
        if (headerSearch) {
          headerSearch.focus();
          headerSearch.select();
        }
      }
    });
  },

  // 4. Global Keyboard Listeners (Escape, Left/Right for Lightbox)
  initKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (window.UI) window.UI.closeAllModals();
        if (window.Cart) window.Cart.close();
        if (window.Router) window.Router.closeMobileMenu();
      } else if (e.key === 'ArrowLeft') {
        if (window.UI && document.getElementById('lightboxModal')?.classList.contains('active')) {
          window.UI.lightboxPrev();
        }
      } else if (e.key === 'ArrowRight') {
        if (window.UI && document.getElementById('lightboxModal')?.classList.contains('active')) {
          window.UI.lightboxNext();
        }
      }
    });
  },

  // 5. Header Search Input & Quick Dropdown
  initHeaderSearchDropdown() {
    const input = document.getElementById('headerSearchInput');
    const dropdown = document.getElementById('headerSearchDropdown');
    if (!input) return;

    input.addEventListener('input', () => {
      const term = input.value.trim();
      if (!term || !dropdown) {
        if (dropdown) dropdown.style.display = 'none';
        return;
      }

      const results = window.SearchEngine.query(term).slice(0, 5);
      if (results.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 12px 16px; font-size: 13px; color: var(--text-muted); text-align: center;">
            No instant matches found. Press Enter for full search.
          </div>
        `;
      } else {
        dropdown.innerHTML = `
          <div style="padding: 8px 12px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border-subtle);">
            Instant Matches (${results.length})
          </div>
          ${results.map(r => `
            <div class="search-drop-item" onclick="App.handleDropItemClick('${r.type}', '${r.id}')" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid var(--border-subtle); transition: background var(--transition-fast);">
              <img src="${r.image}" alt="${r.title}" style="width: 38px; height: 38px; border-radius: var(--radius-sm); object-fit: cover;" />
              <div style="flex: 1; overflow: hidden;">
                <div style="font-size: 13px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.title}</div>
                <div style="font-size: 11px; color: var(--accent-gold);">${r.category} • ${r.typeLabel}</div>
              </div>
            </div>
          `).join('')}
          <div onclick="App.navigateToSearch()" style="padding: 10px 14px; text-align: center; font-size: 12px; font-weight: 700; color: var(--accent-gold); cursor: pointer; background: var(--bg-card);">
            View all results for "${term}" &rarr;
          </div>
        `;
      }
      dropdown.style.display = 'block';
    });

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.navigateToSearch();
      }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (dropdown && !dropdown.contains(e.target) && e.target !== input) {
        dropdown.style.display = 'none';
      }
    });
  },

  handleDropItemClick(type, id) {
    const dropdown = document.getElementById('headerSearchDropdown');
    if (dropdown) dropdown.style.display = 'none';

    if (type === 'article') {
      window.UI.openArticleModal(id);
    } else if (type === 'character') {
      window.UI.openCharacterModal(id);
    } else if (type === 'trailer') {
      window.UI.openVideoModal(id);
    } else {
      window.location.hash = `#search?q=${encodeURIComponent(id)}`;
    }
  },

  navigateToSearch() {
    const input = document.getElementById('headerSearchInput');
    const dropdown = document.getElementById('headerSearchDropdown');
    if (dropdown) dropdown.style.display = 'none';
    if (input && input.value.trim()) {
      window.location.hash = `#search?q=${encodeURIComponent(input.value.trim())}`;
    } else {
      window.location.hash = '#search';
    }
  },

  // 6. Mobile Breadcrumb Toggle
  initBreadcrumbToggle() {
    const nav = document.querySelector('.breadcrumb-nav');
    const toggle = document.getElementById('breadcrumbToggleBtn');
    const list = document.getElementById('globalBreadcrumbsList');
    if (!nav || !toggle || !list) return;

    toggle.addEventListener('click', () => {
      const expanded = nav.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-label', expanded ? 'Hide breadcrumbs' : 'Show breadcrumbs');
      toggle.setAttribute('title', expanded ? 'Hide breadcrumbs' : 'Show breadcrumbs');
    });

    // Keep the desktop breadcrumb state clean if the viewport is resized.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        nav.classList.remove('is-expanded');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  },

  // 7. Mobile Drawer
  initMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggleBtn');
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileNavOverlay');
    const closeBtn = document.getElementById('mobileNavCloseBtn');

    if (toggleBtn && drawer && overlay) {
      toggleBtn.addEventListener('click', () => {
        drawer.classList.add('active');
        overlay.classList.add('active');
      });

      overlay.addEventListener('click', () => {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          drawer.classList.remove('active');
          overlay.classList.remove('active');
        });
      }
    }
  }
};

window.App = App;
