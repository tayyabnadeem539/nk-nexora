/**
 * FandomVerse - Dynamic UI Presentation Engine
 * Renders all views: Home, 7 Category Hubs, Search, Trailers, Events, Merchandise, Bookmarks, About, Contact
 * Manages Modals: Article Reader, Character Profile, Video Player, Lightbox, Dummy Auth
 */

const UI = {
  currentCategoryFilter: 'all',
  currentTypeFilter: 'all',
  currentSort: 'relevance',
  currentGalleryItems: [],
  currentLightboxIndex: 0,
  activeAudioTrack: null,
  audioElement: new Audio(),

  init() {
    this.setupAudioListeners();
    this.initScrollReveal();
  },

  // ==========================================================================
  // Scroll-Triggered Reveal Animations (runs after every view render)
  // ==========================================================================
  initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    if (!this._revealObserver) {
      this._revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            this._revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }

    const targets = document.querySelectorAll(
      '#viewContainer .content-section:not(.reveal-init), ' +
      '#viewContainer .grid-2 > *:not(.reveal-init), ' +
      '#viewContainer .grid-3 > *:not(.reveal-init), ' +
      '#viewContainer .grid-4 > *:not(.reveal-init), ' +
      '#viewContainer .grid-6 > *:not(.reveal-init), ' +
      '#viewContainer .scroll-strip > *:not(.reveal-init)'
    );

    targets.forEach((el, idx) => {
      el.classList.add('reveal-init', 'reveal-up');
      el.style.setProperty('--reveal-delay', `${Math.min(idx % 6, 5) * 70}ms`);
      this._revealObserver.observe(el);
    });
  },

  // ==========================================================================
  // 1. HOME VIEW
  // ==========================================================================
  renderHome() {
    const main = document.getElementById('viewContainer');
    if (!main) return;

    const data = window.FANDOM_DATA || {};
    const categories = data.categories || [];
    const articles = data.articles || [];
    const characters = data.characters || [];
    const trailers = data.trailers || [];
    const events = data.events || [];
    const merchandise = data.merchandise || [];
    const releases = data.releases || [];

    main.innerHTML = `
      <!-- 1. Cinematic Hero Slider (rendered by js/hero-slider.js) -->
      <div id="heroSliderRoot"></div>

      <!-- Category Marquee Strip: continuous looping category names -->
      <div class="category-marquee-bar">
        <div class="marquee-track">
          ${[...categories, ...categories].map(cat => `
            <a href="#${cat.id}" class="marquee-item">
              <span class="marquee-dot" style="background:${cat.color}; color:${cat.color};"></span>
              ${cat.title}
            </a>
            <span class="marquee-sep"></span>
          `).join('')}
        </div>
      </div>

      <!-- Live Portal Dispatch Ticker with Neon Blinking Cursor Animation -->
      <div class="live-portal-ticker-bar">
        <div class="container">
          <div class="ticker-inner">
            <div class="ticker-badge">
              <span class="ticker-live-dot"></span>
              <span class="ticker-badge-text">PORTAL TRANSMISSION</span>
            </div>
            <div class="ticker-stream">
              <span class="ticker-prefix">Now Trending:</span>
              <span id="homeTypingText" class="ticker-typed-text"></span>
              <span class="ticker-cursor-beam">|</span>
            </div>
            <div class="ticker-meta-pill">
              <span class="sparkle-symbol"></span> 7 Fandom Dimensions Active
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Fast Category Hubs Strip -->
      <section class="content-section" style="padding: 28px 0; background-color: var(--bg-surface); border-bottom: 1px solid var(--border-subtle);">
        <div class="container">
          <div class="grid-6">
            ${categories.map(cat => `
              <a href="#${cat.id}" class="card-hub-quick">
                <img class="card-hub-bg" src="${cat.banner}" alt="${cat.title}" />
                <div class="card-hub-overlay">
                  <div class="card-hub-tagline">${cat.stats.articles}+ Articles</div>
                  <div class="card-hub-title">${cat.title}</div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- 3. Trending Now Strip (10+ Cards across categories) -->
      <section class="content-section">
        <div class="container">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2 class="section-title">Trending Across Fandoms</h2>
              <p class="section-subtitle">The hottest topics, breaking adaptations, and fan milestones this week</p>
            </div>
          </div>

          <div class="scroll-strip-wrap">
            <button class="scroll-arrow-btn scroll-arrow-prev" onclick="UI.scrollStrip('trendingStrip', -360)" aria-label="Scroll left">&#10094;</button>
            <div class="scroll-strip" id="trendingStrip">
              ${categories.map(cat => articles.find(a => a.category === cat.id)).filter(Boolean)
                .map(art => this.renderArticleCard(art)).join('')}
            </div>
            <button class="scroll-arrow-btn scroll-arrow-next" onclick="UI.scrollStrip('trendingStrip', 360)" aria-label="Scroll right">&#10095;</button>
          </div>
        </div>
      </section>

      <!-- 4. Featured In-Depth Articles Grid (8 Cards) -->
      <section class="content-section" style="background-color: var(--bg-primary);">
        <div class="container">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2 class="section-title">Featured Long-Form & Editorial</h2>
              <p class="section-subtitle">Deep dive retrospectives, creator spotlights, and production breakdowns</p>
            </div>
          </div>

          <div class="grid-4">
            ${[...categories.map(cat => articles.filter(a => a.category === cat.id)[1]), articles.filter(a => a.category === 'anime')[2]].filter(Boolean).map(art => this.renderArticleCard(art)).join('')}
          </div>
        </div>
      </section>

      <!-- 5. Popular Characters Spotlight (8 Cards) -->
      <section class="content-section">
        <div class="container">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2 class="section-title">Iconic Characters & Dossiers</h2>
              <p class="section-subtitle">Explore biographies, key traits, and series lore for fan-favorite protagonists</p>
            </div>
            <a href="#anime" class="section-action-link">All 35+ Character Profiles &rarr;</a>
          </div>

          <div class="grid-4">
            ${characters.slice(0, 8).map(char => this.renderCharacterCard(char)).join('')}
          </div>
        </div>
      </section>

      <!-- 6. Latest Trailers & Media Showcase (6 Video Cards) -->
      <section class="content-section" style="background-color: var(--bg-primary);">
        <div class="container">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2 class="section-title">Latest Trailers & Media Hub</h2>
              <p class="section-subtitle">High-definition teaser trailers, director interviews, and podcasts</p>
            </div>
            <a href="#trailers" class="section-action-link">Browse All Media &rarr;</a>
          </div>

          <div class="grid-3">
            ${trailers.slice(0, 6).map(tr => this.renderTrailerCard(tr)).join('')}
          </div>
        </div>
      </section>

      <!-- 7. Upcoming Events Highlights (4 Cards) -->
      <section class="content-section">
        <div class="container">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2 class="section-title">Upcoming Fandom Events</h2>
              <p class="section-subtitle">Conventions, global festivals, and premier award celebrations</p>
            </div>
            <a href="#events" class="section-action-link">Full Events Calendar &rarr;</a>
          </div>

          <div class="grid-2">
            ${events.filter(e => e.status === 'upcoming').slice(0, 4).map(ev => this.renderEventCard(ev)).join('')}
          </div>
        </div>
      </section>

      <!-- 8. Official Merchandise Showcase (6 Cards) -->
      <section class="content-section" style="background-color: var(--bg-primary);">
        <div class="container">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2 class="section-title">Official Fan Merchandise</h2>
              <p class="section-subtitle">Explore officially licensed figures, collectibles, apparel, and vinyl editions</p>
            </div>
            <a href="#merch" class="section-action-link">View Full Store &rarr;</a>
          </div>

          <div class="grid-3">
            ${merchandise.slice(0, 6).map(m => this.renderMerchCard(m)).join('')}
          </div>
        </div>
      </section>

      <!-- 9. Release Radar / Calendar (6 Items) -->
      <section class="content-section">
        <div class="container">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2 class="section-title">Upcoming Release Radar</h2>
              <p class="section-subtitle">Track dates for upcoming video games, movies, anime seasons, and albums</p>
            </div>
          </div>

          <div class="grid-2">
            ${releases.slice(0, 6).map(rel => this.renderReleaseCard(rel)).join('')}
          </div>
        </div>
      </section>
    `;

    if (typeof HeroSlider !== 'undefined') HeroSlider.init('heroSliderRoot', HERO_SLIDES);
    this.initTypingAnimation();
  },

  initTypingAnimation() {
    const el = document.getElementById('homeTypingText');
    if (!el) return;

    if (this._typingTimeout) clearTimeout(this._typingTimeout);

    const phrases = [
      "Demon Slayer: Infinity Castle Arc global theatrical trilogy officially confirmed.",
      "One Piece Episode 1100: Egghead Island Climax streaming in crystal 4K.",
      "Grand Theft Auto VI: Returning to neon Vice City with Lucia and Jason.",
      "Dune: Part Two achieves historic IMAX celluloid cinematic acclaim.",
      "Over 35+ iconic character dossiers unlocked with deep canon lore.",
      "Listen to weekly anime & gaming podcasts directly in your browser."
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const tick = () => {
      const currentEl = document.getElementById('homeTypingText');
      if (!currentEl) return;

      const currentPhrase = phrases[phraseIdx];

      if (!isDeleting) {
        charIdx++;
        currentEl.textContent = currentPhrase.substring(0, charIdx);
        if (charIdx === currentPhrase.length) {
          isDeleting = true;
          this._typingTimeout = setTimeout(tick, 2200);
          return;
        }
      } else {
        charIdx--;
        currentEl.textContent = currentPhrase.substring(0, charIdx);
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          this._typingTimeout = setTimeout(tick, 450);
          return;
        }
      }

      const speed = isDeleting ? 25 : 50;
      this._typingTimeout = setTimeout(tick, speed);
    };

    tick();
  },

  scrollStrip(id, distance) {
    const el = document.getElementById(id);
    if (el) el.scrollBy({ left: distance, behavior: 'smooth' });
  },

  // ==========================================================================
  // 2. CATEGORY HUB VIEW (Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga)
  // ==========================================================================
  renderCategory(categoryId, activeTab = 'all') {
    const main = document.getElementById('viewContainer');
    if (!main) return;

    const data = window.FANDOM_DATA || {};
    const cat = data.categories?.find(c => c.id === categoryId);
    if (!cat) {
      this.renderNotFound();
      return;
    }

    const catArticles = (data.articles || []).filter(a => a.category === categoryId);
    const catCharacters = (data.characters || []).filter(c => c.category === categoryId);
    const catTrailers = (data.trailers || []).filter(t => t.category === categoryId);
    const catEvents = (data.events || []).filter(e => e.category === categoryId);
    const catMerch = (data.merchandise || []).filter(m => m.category === categoryId);
    const catReleases = (data.releases || []).filter(r => r.category === categoryId);
    const catGallery = (data.galleries && data.galleries[categoryId]) || [];

    main.innerHTML = `
      <!-- Category Hero Header -->
      <header class="category-hero-header" style="--category-color-alpha: ${cat.color}22;">
        <div class="container">
          <div class="cat-hero-flex">
            <div class="cat-hero-main">
              <span class="cat-badge-chip">${cat.title} Fandom Hub</span>
              <h1 class="cat-hero-title">${cat.title}: ${cat.tagline}</h1>
              <p class="cat-hero-desc">${cat.description}</p>
              <div class="cat-subgenre-pills">
                ${cat.subgenres.map(sg => `<span class="subgenre-pill">${sg}</span>`).join('')}
              </div>
            </div>

            <div class="cat-stats-card">
              <div class="cat-stat-box">
                <span class="cat-stat-num">${catArticles.length}</span>
                <span class="cat-stat-label">Articles</span>
              </div>
              <div class="cat-stat-box">
                <span class="cat-stat-num">${catCharacters.length}</span>
                <span class="cat-stat-label">Characters</span>
              </div>
              <div class="cat-stat-box">
                <span class="cat-stat-num">${catTrailers.length}</span>
                <span class="cat-stat-label">Media Clips</span>
              </div>
              <div class="cat-stat-box">
                <span class="cat-stat-num">${catGallery.length}</span>
                <span class="cat-stat-label">Gallery Stills</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Category Navigation & Sub-Filters -->
      <section class="content-section" style="padding: 16px 0;">
        <div class="container">
          <div class="filter-bar-wrap">
            <div class="filter-pills-list">
              <button class="filter-pill ${activeTab === 'all' ? 'active' : ''}" onclick="UI.renderCategory('${categoryId}', 'all')">All Content</button>
              <button class="filter-pill ${activeTab === 'articles' ? 'active' : ''}" onclick="UI.renderCategory('${categoryId}', 'articles')">Articles (${catArticles.length})</button>
              <button class="filter-pill ${activeTab === 'characters' ? 'active' : ''}" onclick="UI.renderCategory('${categoryId}', 'characters')">Characters (${catCharacters.length})</button>
              <button class="filter-pill ${activeTab === 'media' ? 'active' : ''}" onclick="UI.renderCategory('${categoryId}', 'media')">Trailers & Audio (${catTrailers.length})</button>
              <button class="filter-pill ${activeTab === 'gallery' ? 'active' : ''}" onclick="UI.renderCategory('${categoryId}', 'gallery')">Image Gallery (${catGallery.length})</button>
              <button class="filter-pill ${activeTab === 'events' ? 'active' : ''}" onclick="UI.renderCategory('${categoryId}', 'events')">Events (${catEvents.length})</button>
              <button class="filter-pill ${activeTab === 'merch' ? 'active' : ''}" onclick="UI.renderCategory('${categoryId}', 'merch')">Merchandise (${catMerch.length})</button>
            </div>

            <div class="sort-select-wrap">
              <label for="catSortSelect">Sort By:</label>
              <select id="catSortSelect" class="custom-select" onchange="UI.handleCatSort('${categoryId}', this.value)">
                <option value="newest">Newest First</option>
                <option value="alpha">Alphabetical (A-Z)</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          <!-- Dynamic Tab Content Rendering -->
          <div id="categoryTabContainer">
            ${this.renderCategoryTabContent(categoryId, activeTab, {
              catArticles, catCharacters, catTrailers, catEvents, catMerch, catReleases, catGallery
            })}
          </div>
        </div>
      </section>
    `;
  },

  renderCategoryTabContent(categoryId, activeTab, data) {
    const { catArticles, catCharacters, catTrailers, catEvents, catMerch, catReleases, catGallery } = data;

    if (activeTab === 'articles') {
      return `
        <div class="grid-4">
          ${catArticles.map(a => this.renderArticleCard(a)).join('')}
        </div>
      `;
    }

    if (activeTab === 'characters') {
      return `
        <div class="grid-4">
          ${catCharacters.map(c => this.renderCharacterCard(c)).join('')}
        </div>
      `;
    }

    if (activeTab === 'media') {
      return `
        <div class="grid-3">
          ${catTrailers.map(t => this.renderTrailerCard(t)).join('')}
        </div>
      `;
    }

    if (activeTab === 'gallery') {
      return this.renderGalleryGrid(categoryId, catGallery);
    }

    if (activeTab === 'events') {
      return `
        <div class="grid-2">
          ${catEvents.map(e => this.renderEventCard(e)).join('')}
        </div>
      `;
    }

    if (activeTab === 'merch') {
      return `
        <div class="grid-3">
          ${catMerch.map(m => this.renderMerchCard(m)).join('')}
        </div>
      `;
    }

    // Default 'all' Tab - Multi-section dense layout
    return `
      <!-- Featured Long-form Articles -->
      <div style="margin-bottom: 40px;">
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h2 class="section-title">Latest Articles & Reviews</h2>
            <p class="section-subtitle">In-depth stories, analysis, and news for ${categoryId.toUpperCase()}</p>
          </div>
        </div>
        <div class="grid-4">
          ${catArticles.slice(0, 4).map(a => this.renderArticleCard(a)).join('')}
        </div>
      </div>

      <!-- Character Profiles Section (SRS: >= 5 characters) -->
      <div style="margin-bottom: 40px;">
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h2 class="section-title">Key Character Profiles</h2>
            <p class="section-subtitle">Detailed dossiers, biographies, and iconic traits</p>
          </div>
        </div>
        <div class="grid-4">
          ${catCharacters.map(c => this.renderCharacterCard(c)).join('')}
        </div>
      </div>

      <!-- Category Image Gallery with Lightbox -->
      <div style="margin-bottom: 40px;">
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h2 class="section-title">${categoryId.toUpperCase()} Visual Gallery</h2>
            <p class="section-subtitle">Click any image to view in high-resolution interactive Lightbox</p>
          </div>
        </div>
        ${this.renderGalleryGrid(categoryId, catGallery)}
      </div>

      <!-- Trailers, Interviews & Playable Audio Podcasts -->
      <div style="margin-bottom: 40px;">
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h2 class="section-title">Featured Media, Video & Audio</h2>
            <p class="section-subtitle">Trailers, creator interviews, and podcast episodes</p>
          </div>
        </div>
        <div class="grid-3">
          ${catTrailers.map(t => this.renderTrailerCard(t)).join('')}
        </div>
      </div>

      <!-- Category Events (SRS: >= 3 events) -->
      <div style="margin-bottom: 40px;">
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h2 class="section-title">Conventions & Highlights</h2>
            <p class="section-subtitle">Past and upcoming community gatherings</p>
          </div>
        </div>
        <div class="grid-2">
          ${catEvents.map(e => this.renderEventCard(e)).join('')}
        </div>
      </div>

      <!-- Category Merchandise -->
      ${catMerch.length > 0 ? `
        <div style="margin-bottom: 40px;">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2 class="section-title">Featured Collectibles & Merch</h2>
              <p class="section-subtitle">Officially licensed fan gear</p>
            </div>
          </div>
          <div class="grid-3">
            ${catMerch.map(m => this.renderMerchCard(m)).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Upcoming Release Radar -->
      ${catReleases.length > 0 ? `
        <div>
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h2 class="section-title">Upcoming Releases</h2>
              <p class="section-subtitle">Dates for upcoming premier works</p>
            </div>
          </div>
          <div class="grid-2">
            ${catReleases.map(r => this.renderReleaseCard(r)).join('')}
          </div>
        </div>
      ` : ''}
    `;
  },

  handleCatSort(categoryId, sortType) {
    const data = window.FANDOM_DATA || {};
    let catArticles = (data.articles || []).filter(a => a.category === categoryId);

    if (sortType === 'alpha') {
      catArticles.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'popular') {
      catArticles.sort((a, b) => parseInt(b.readTime || '5') - parseInt(a.readTime || '5'));
    } else {
      catArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const container = document.getElementById('categoryTabContainer');
    if (container) {
      container.innerHTML = `
        <div class="grid-4">
          ${catArticles.map(a => this.renderArticleCard(a)).join('')}
        </div>
      `;
    }
  },

  // ==========================================================================
  // 3. IMAGE GALLERY & LIGHTBOX
  // ==========================================================================
  renderGalleryGrid(categoryId, items) {
    this.currentGalleryItems = items;
    return `
      <div class="grid-3">
        ${items.map((img, idx) => `
          <div class="card-base" style="cursor: pointer;" onclick="UI.openLightbox('${categoryId}', ${idx})">
            <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; background-color: #000;">
              <img src="${img.image}" alt="${img.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow);" />
              <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 11px; color: var(--accent-gold); display: flex; align-items: center; gap: 4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                Enlarge
              </div>
            </div>
            <div style="padding: 12px 14px;">
              <h4 style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 2px;">${img.title}</h4>
              <p style="font-size: 12px; color: var(--text-secondary);">${img.caption}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  openLightbox(categoryId, index) {
    const data = window.FANDOM_DATA || {};
    this.currentGalleryItems = (data.galleries && data.galleries[categoryId]) || [];
    this.currentLightboxIndex = index;

    const modal = document.getElementById('lightboxModal');
    if (!modal) return;

    this.updateLightboxContent();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  updateLightboxContent() {
    const item = this.currentGalleryItems[this.currentLightboxIndex];
    if (!item) return;

    const imgEl = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxCaption');
    const countEl = document.getElementById('lightboxCounter');

    if (imgEl) imgEl.src = item.image;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.caption;
    if (countEl) countEl.textContent = `${this.currentLightboxIndex + 1} of ${this.currentGalleryItems.length}`;
  },

  lightboxPrev() {
    if (this.currentGalleryItems.length === 0) return;
    this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.currentGalleryItems.length) % this.currentGalleryItems.length;
    this.updateLightboxContent();
  },

  lightboxNext() {
    if (this.currentGalleryItems.length === 0) return;
    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.currentGalleryItems.length;
    this.updateLightboxContent();
  },

  closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // ==========================================================================
  // 4. GLOBAL SEARCH VIEW
  // ==========================================================================
  renderSearch(initialTerm = '') {
    const main = document.getElementById('viewContainer');
    if (!main) return;

    const categories = ['all', 'anime', 'gaming', 'movies', 'tv-shows', 'k-pop', 'comics', 'manga'];
    const types = ['all', 'article', 'character', 'trailer', 'event', 'merchandise', 'release'];

    main.innerHTML = `
      <section class="content-section">
        <div class="container">
          <div class="section-title-wrap" style="margin-bottom: 24px;">
            <h1 class="section-title">Global Fandom Search</h1>
            <p class="section-subtitle">Real-time search across all 7 categories, articles, characters, trailers, events, and merchandise</p>
          </div>

          <!-- Search Input & Filters Box -->
          <div style="background-color: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 30px;">
            <div style="display: flex; gap: 12px; margin-bottom: 20px;">
              <input type="text" id="mainSearchInput" class="header-search-input" value="${initialTerm}" placeholder="Search for characters, franchises, trailers, conventions..." style="background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 12px 18px; border-radius: var(--radius-md); font-size: 16px; width: 100%; color: #fff;" />
              <button type="button" class="btn-hero-primary" onclick="UI.executeSearch()" style="white-space: nowrap;">
                Search
              </button>
            </div>

            <!-- Category & Type Filter Bars -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Category:</span>
                ${categories.map(c => `
                  <button type="button" class="filter-pill ${c === this.currentCategoryFilter ? 'active' : ''}" onclick="UI.setSearchCategoryFilter('${c}')">
                    ${c.toUpperCase()}
                  </button>
                `).join('')}
              </div>

              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Content Type:</span>
                ${types.map(t => `
                  <button type="button" class="filter-pill ${t === this.currentTypeFilter ? 'active' : ''}" onclick="UI.setSearchTypeFilter('${t}')">
                    ${t.toUpperCase()}
                  </button>
                `).join('')}
              </div>

              <div style="display: flex; align-items: center; gap: 12px; margin-top: 6px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
                <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Sort Order:</span>
                <select id="searchSortSelect" class="custom-select" onchange="UI.setSearchSort(this.value)">
                  <option value="relevance" ${this.currentSort === 'relevance' ? 'selected' : ''}>Relevance</option>
                  <option value="newest" ${this.currentSort === 'newest' ? 'selected' : ''}>Newest First</option>
                  <option value="alpha" ${this.currentSort === 'alpha' ? 'selected' : ''}>Alphabetical (A-Z)</option>
                  <option value="popular" ${this.currentSort === 'popular' ? 'selected' : ''}>Most Popular</option>
                </select>
                <div id="searchResultCount" style="margin-left: auto; font-size: 13px; color: var(--accent-gold); font-weight: 600;"></div>
              </div>
            </div>
          </div>

          <!-- Results Container -->
          <div id="searchResultsGrid" class="grid-4"></div>
        </div>
      </section>
    `;

    // Bind real-time input
    const input = document.getElementById('mainSearchInput');
    if (input) {
      input.addEventListener('input', () => this.executeSearch());
      input.addEventListener('keyup', (e) => { if (e.key === 'Enter') this.executeSearch(); });
    }

    this.executeSearch();
  },

  setSearchCategoryFilter(cat) {
    this.currentCategoryFilter = cat;
    this.renderSearch(document.getElementById('mainSearchInput')?.value || '');
  },

  setSearchTypeFilter(type) {
    this.currentTypeFilter = type;
    this.renderSearch(document.getElementById('mainSearchInput')?.value || '');
  },

  setSearchSort(sort) {
    this.currentSort = sort;
    this.executeSearch();
  },

  executeSearch() {
    const input = document.getElementById('mainSearchInput');
    const grid = document.getElementById('searchResultsGrid');
    const countEl = document.getElementById('searchResultCount');
    if (!grid) return;

    const term = input ? input.value : '';
    const results = window.SearchEngine.query(term, {
      category: this.currentCategoryFilter,
      type: this.currentTypeFilter,
      sort: this.currentSort
    });

    if (countEl) {
      countEl.textContent = `Found ${results.length} matching results`;
    }

    if (results.length === 0) {
      grid.className = '';
      grid.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
          <h3 style="font-size: 18px; color: #fff; margin-bottom: 8px;">No matching results found</h3>
          <p style="font-size: 14px; color: var(--text-secondary); max-width: 450px; margin: 0 auto;">Try adjusting your search terms, clearing category filters, or selecting 'All' content types.</p>
        </div>
      `;
      return;
    }

    grid.className = 'grid-4';
    grid.innerHTML = results.map(item => {
      if (item.type === 'article') return this.renderArticleCard(item.rawItem, term);
      if (item.type === 'character') return this.renderCharacterCard(item.rawItem, term);
      if (item.type === 'trailer') return this.renderTrailerCard(item.rawItem, term);
      if (item.type === 'event') return this.renderEventCard(item.rawItem, term);
      if (item.type === 'merchandise') return this.renderMerchCard(item.rawItem, term);
      if (item.type === 'release') return this.renderReleaseCard(item.rawItem, term);
      return '';
    }).join('');
  },

  // ==========================================================================
  // 5. BOOKMARKS & SESSION NOTES VIEW
  // ==========================================================================
  renderBookmarks() {
    const main = document.getElementById('viewContainer');
    if (!main) return;

    const items = window.Bookmarks.getAll();

    main.innerHTML = `
      <section class="content-section">
        <div class="container">
          <div class="section-header-row" style="align-items: center;">
            <div class="section-title-wrap">
              <h1 class="section-title">Your Saved Bookmarks</h1>
              <p class="section-subtitle">Stored in your browser's Local Storage. Attach personal session notes or export your collection.</p>
            </div>
            <div style="display: flex; gap: 10px;">
              <button type="button" class="btn-hero-primary" onclick="Bookmarks.exportFormattedList()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export Bookmarks (.md)
              </button>
            </div>
          </div>

          ${items.length === 0 ? `
            <div style="text-align: center; padding: 80px 20px; background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; color: var(--accent-gold); opacity: 0.6;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              <h3 style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 8px;">No bookmarks saved yet</h3>
              <p style="font-size: 14px; color: var(--text-secondary); max-width: 420px; margin: 0 auto 20px;">Click the bookmark icon on any article, character, or event card to build your personalized fandom library.</p>
              <a href="#home" class="btn-hero-primary">Explore Content</a>
            </div>
          ` : `
            <div class="grid-3">
              ${items.map(b => this.renderBookmarkCard(b)).join('')}
            </div>
          `}
        </div>
      </section>
    `;
  },

  renderBookmarkCard(item) {
    const note = window.Bookmarks.getNote(item.id);

    return `
      <div class="card-base" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;" data-id="${item.id}">
        <div style="display: flex; gap: 12px;">
          <img src="${item.image}" alt="${item.title}" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-sm);" />
          <div style="flex: 1;">
            <div style="font-size: 11px; font-weight: 700; color: var(--accent-gold); text-transform: uppercase;">${item.category} â€¢ ${item.type}</div>
            <h4 style="font-size: 15px; font-weight: 700; color: #fff; line-height: 1.3; margin: 4px 0;">${item.title}</h4>
            <div style="font-size: 11px; color: var(--text-muted);">Saved: ${item.dateSaved}</div>
          </div>
          <button type="button" onclick="Bookmarks.remove('${item.id}'); UI.renderBookmarks();" style="color: var(--text-muted); align-self: flex-start;" title="Remove Bookmark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Session Note Area (SRS: Personal notes session-only) -->
        <div style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px; margin-top: auto;">
          <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px; display: flex; justify-content: space-between;">
            <span>Personal Note (Session Only):</span>
            ${note ? `<button type="button" onclick="Bookmarks.deleteNote('${item.id}'); UI.renderBookmarks();" style="color: var(--accent-red); font-size: 10px;">Clear</button>` : ''}
          </div>
          <textarea id="note-input-${item.id}" rows="2" style="width: 100%; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 6px 8px; font-size: 12px; color: #fff; resize: none;" placeholder="Add thoughts, episode notes, reminders...">${note}</textarea>
          <button type="button" class="btn-read-link" onclick="UI.saveSessionNote('${item.id}')" style="margin-top: 6px; font-size: 11px;">
            Save Note to Session
          </button>
        </div>
      </div>
    `;
  },

  saveSessionNote(id) {
    const input = document.getElementById(`note-input-${id}`);
    if (input) {
      window.Bookmarks.saveNote(id, input.value);
      alert('Note saved for the current browser session!');
    }
  },

  // ==========================================================================
  // 6. DEDICATED TRAILERS & MEDIA VIEW
  // ==========================================================================
renderTrailers(filterCat = 'all') {
  const main = document.getElementById('viewContainer');
  if (!main) return;

  const oldVideo = document.getElementById('fvTheatreVideo');
  if (oldVideo) oldVideo.pause();

  const data = window.FANDOM_DATA || {};
  const categories = ['all', 'anime', 'gaming', 'movies', 'tv-shows', 'k-pop', 'comics', 'manga'];

  const list = (data.trailers || []).filter(
    item => filterCat === 'all' || item.category === filterCat
  );

  const clips = list.filter(
    item => item.mediaType !== 'podcast' && item.youtubeId
  );

  // Prioritize trailers that have existing local video files so playback works immediately
  const localVideoIds = ['Way9Dexny3w', 'a9tq0aS5Zu8', 'QdBZY2fkU-0', 'Jb_Z-3d6D8U'];
  clips.sort((a, b) => {
    const aHas = localVideoIds.includes(a.youtubeId) ? 1 : 0;
    const bHas = localVideoIds.includes(b.youtubeId) ? 1 : 0;
    return bHas - aHas;
  });

  const featured = clips[0] || (data.trailers || [])[0];

  main.innerHTML = `
    <section class="content-section">
      <div class="container">
        <div class="section-header-row">
          <div class="section-title-wrap">
            <h1 class="section-title">Trailers, Interviews & Audio Hub</h1>
            <p class="section-subtitle">
              Aggregated multimedia showcases, official announcement trailers, and IMAX 3D Cinema
            </p>
          </div>
        </div>

        <!-- Interactive Trailer Search & Discovery Bar -->
        <div class="fv-trailer-search">
          <label for="fvTrailerQuery">FIND YOUR NEXT TRAILER</label>
          <div class="fv-trailer-search-field">
            <span aria-hidden="true">âŒ•</span>
            <input
              id="fvTrailerQuery"
              type="search"
              placeholder="Search a movie, trailer, anime or game franchise..."
              autocomplete="off"
              aria-controls="fvTrailerResults">
          </div>
          <div class="fv-trending-line">
            <span>POPULAR IN CINEMA</span>
            <div id="fvTrendingMovies" class="fv-trending-chips"></div>
          </div>
          <div id="fvTrailerResults" class="fv-trailer-results" aria-live="polite"></div>
        </div>

        ${featured ? `
          <!-- 3D GRAND IMAX THEATER -->
          <div class="fv-theatre" id="fvTheatre">
            <!-- Cinema Top Bar & Controls HUD -->
            <div class="fv-theatre-top">
              <div class="fv-theatre-brand-row">
                <span class="fv-theatre-label">
                  <i></i> FANDOMVERSE GRAND IMAX THEATER
                </span>
                <span class="fv-theatre-status-pill" id="fvTheatreStatusPill">DOLBY ATMOS 4K</span>
              </div>

              <div class="fv-theatre-toolbar">
                <button type="button" class="fv-theatre-btn" id="fvBtnRecenter" onclick="UI.recenterTheatre()" title="Reset Camera to Center Screen">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
                  <span>Center View</span>
                </button>

                <button type="button" class="fv-theatre-btn" id="fvBtnCurtains" onclick="UI.toggleCurtains()" title="Open / Close Red Velvet Curtains">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4"/><path d="M4 9h16"/><path d="M9 4v16"/><path d="M15 4v16"/></svg>
                  <span id="fvCurtainBtnText">Curtains: Closed</span>
                </button>

                <button type="button" class="fv-theatre-btn" id="fvBtnLights" onclick="UI.toggleTheatreLights()" title="Dim / Brighten Hall Lights">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7a5 5 0 0 1 5 5c0 2-1 3.5-2 4.5V17H9v-.5C8 15.5 7 14 7 12a5 5 0 0 1 5-5z"/></svg>
                  <span id="fvLightsBtnText">Lights: Hall</span>
                </button>

                <button type="button" class="fv-theatre-btn" id="fvBtnCinemaMode" onclick="UI.toggleCinemaMode()" title="Toggle Widescreen IMAX Mode">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                  <span>IMAX Mode</span>
                </button>

                <button
                  class="fv-theatre-exit"
                  type="button"
                  onclick="UI.stopTheatre()">
                  â† Close Showtime
                </button>
              </div>
            </div>

            <!-- 3D Spatial Scene -->
            <div class="fv-theatre-scene" id="fvTheatreScene">
              <div class="fv-theatre-room" id="fvTheatreRoom">
                <!-- Left Acoustic Wall with Sconces and Speakers -->
                <div class="fv-theatre-wall fv-theatre-wall-left">
                  <div class="fv-wall-speaker"></div>
                  <div class="fv-wall-sconce"></div>
                </div>

                <!-- Right Acoustic Wall with Sconces and Emergency Exit -->
                <div class="fv-theatre-wall fv-theatre-wall-right">
                  <div class="fv-wall-speaker"></div>
                  <div class="fv-wall-sconce"></div>
                  <div class="fv-wall-exit-sign">EXIT âž”</div>
                </div>

                <!-- Acoustic Ceiling with Starry Fiber Optics -->
                <div class="fv-theatre-ceiling"></div>

                <!-- Sloped Carpet Floor with Aisle Step Light Runners -->
                <div class="fv-theatre-floor"></div>

                <!-- Back Wall (Seen on 180Â° drag look-around) -->
                <div class="fv-theatre-back-wall">
                  <div class="fv-theatre-back-wall-title">â˜… FANDOMVERSE GRAND IMAX THEATER â˜…</div>
                  <div class="fv-projector-booth">
                    <div class="fv-projector-lens"></div>
                    <span>4K LASER PROJECTION BOOTH</span>
                  </div>
                  <div class="fv-back-doors">
                    <div class="fv-back-door">AUDITORIUM ENTRANCE A</div>
                    <div class="fv-back-door">AUDITORIUM ENTRANCE B</div>
                  </div>
                </div>

                <!-- Volumetric Projector Light Beam -->
                <div class="fv-projector-beam"></div>

                <!-- Big Cinema Screen & Velvet Curtains Frame -->
                <div class="fv-theatre-screen">
                  <video
                    id="fvTheatreVideo"
                    controls
                    playsinline
                    preload="metadata"
                    poster="${featured.thumbnail || ''}">
                    <source src="videos/${featured.youtubeId}.mp4" type="video/mp4">
                  </video>

                  <!-- Red Velvet Curtains Assembly -->
                  <div class="fv-theatre-curtains" id="fvTheatreCurtains">
                    <div class="fv-curtain-valance">
                      <span class="fv-curtain-valance-title">â˜… FANDOMVERSE GRAND CINEMA â˜…</span>
                    </div>
                    <div class="fv-curtain-left">
                      <span class="fv-curtain-tassel fv-curtain-tassel-left"></span>
                    </div>
                    <div class="fv-curtain-right">
                      <span class="fv-curtain-tassel fv-curtain-tassel-right"></span>
                    </div>
                  </div>

                  <!-- Play Featured Button Overlay -->
                  <button
                    class="fv-theatre-play"
                    type="button"
                    onclick="UI.playTheatre('${featured.id}', true)"
                    aria-label="Play featured trailer">
                    <span>â–¶</span>
                    OPEN CURTAINS & PLAY TRAILER
                  </button>
                </div>

                <!-- Expanded Realistic Tiered Cinema Audience -->
                <div class="fv-theatre-audience" aria-hidden="true">
                  ${this.renderAudienceHTML()}
                </div>
              </div>
            </div>

            <!-- Bottom Details Bar -->
            <div class="fv-theatre-details">
              <div>
                <span class="fv-theatre-kicker">NOW SHOWING IN CINEMA</span>
                <h2 id="fvTheatreTitle">${featured.title}</h2>
              </div>

              <span class="fv-theatre-hint" id="fvTheatreHint">
                Move mouse to look Â· Drag for 360Â° Â· Click any trailer to open curtains & play
              </span>
            </div>
          </div>

          <!-- Featured Trailer Quick Picks Carousel -->
          <div class="fv-theatre-picks">
            ${clips.slice(0, 6).map((clip, index) => `
              <button
                type="button"
                class="fv-theatre-pick ${index === 0 ? 'is-selected' : ''}"
                data-theatre-id="${clip.id}"
                onclick="UI.playTheatre('${clip.id}', true)">

                <img src="${clip.thumbnail || ''}" alt="" loading="lazy">

                <span>
                  <small>${clip.category.replace('-', ' ').toUpperCase()}</small>
                  <strong>${clip.title}</strong>
                </span>

                <b>â–¶</b>
              </button>
            `).join('')}
          </div>
        ` : ''}

        <div class="filter-pills-list fv-theatre-filters">
          ${categories.map(category => `
            <button
              class="filter-pill ${category === filterCat ? 'active' : ''}"
              onclick="UI.renderTrailers('${category}')">
              ${category.toUpperCase()}
            </button>
          `).join('')}
        </div>

        <div class="grid-3">
          ${list.map(item => this.renderTrailerCard(item)).join('')}
        </div>
      </div>
    </section>
  `;

  // Attach search bar functionality
  this.setupTrailerSearch(clips);

  // Attach 3D interactive look-around & camera tracking
  const scene = document.getElementById('fvTheatreScene');
  const room = document.getElementById('fvTheatreRoom');
  const video = document.getElementById('fvTheatreVideo');

  if (scene && room) {
    this.setupTheatreScene(scene, room, video);
  }
},

renderAudienceHTML() {
  // Row 1: Mid Tier (7 audience members seated in cinema chairs)
  const row1 = [
    { skin: '#c68d6d', hair: '#1c1917', shirt: '#1e3a8a', hairClass: '', angle: -5 },
    { skin: '#e2ab8a', hair: '#291811', shirt: '#065f46', hairClass: 'fv-hair-ponytail', angle: -2 },
    { skin: '#a3704c', hair: '#121214', shirt: '#7f1d1d', hairClass: '', angle: 1 },
    { skin: '#d29a77', hair: '#2e1c14', shirt: '#374151', hairClass: 'fv-hair-curly', angle: 0 },
    { skin: '#b57c5a', hair: '#18181b', shirt: '#854d0e', hairClass: '', angle: 3 },
    { skin: '#dd9f7d', hair: '#27272a', shirt: '#1f2937', hairClass: 'fv-hair-cap', angle: -2 },
    { skin: '#9b6443', hair: '#171318', shirt: '#312e81', hairClass: '', angle: 5 }
  ];

  // Row 2: Foreground VIP Tier (7 high-detail audience members with Popcorn & Soda)
  const row2 = [
    { skin: '#b88063', hair: '#171318', shirt: '#18181b', hairClass: '', angle: -4, seat: 'VIP-1', prop: '' },
    { skin: '#d5a487', hair: '#2e211e', shirt: '#991b1b', hairClass: 'fv-hair-curly', angle: -2, seat: 'VIP-2', prop: 'popcorn' },
    { skin: '#e8b896', hair: '#141416', shirt: '#27272a', hairClass: '', angle: 1, seat: 'VIP-3', prop: '' },
    { skin: '#966c59', hair: '#161418', shirt: '#1e293b', hairClass: '', angle: 0, seat: 'VIP-4', prop: '' },
    { skin: '#c99370', hair: '#34221b', shirt: '#3f6212', hairClass: '', angle: 3, seat: 'VIP-5', prop: 'soda' },
    { skin: '#deb090', hair: '#18181b', shirt: '#312e81', hairClass: 'fv-hair-curly', angle: -2, seat: 'VIP-6', prop: '' },
    { skin: '#a57353', hair: '#1a191f', shirt: '#831843', hairClass: '', angle: 4, seat: 'VIP-7', prop: '' }
  ];

  const renderSeat = (p, idx, isRow2) => `
    <div class="fv-viewer-seat fv-viewer-${idx + 1}" style="transform: rotate(${p.angle}deg);">
      <div class="fv-seat-chair">
        <span class="fv-seat-armrest fv-seat-armrest-left"></span>
        <span class="fv-seat-armrest fv-seat-armrest-right"></span>
      </div>
      ${p.prop === 'popcorn' ? `<span class="fv-item-popcorn" title="Movie Popcorn"></span>` : ''}
      ${p.prop === 'soda' ? `<span class="fv-item-soda" title="Cinema Drink"></span>` : ''}
      <div class="fv-viewer-human" style="--skin:${p.skin}; --hair:${p.hair}; --shirt:${p.shirt};">
        <div class="fv-viewer-head">
          <div class="fv-hair ${p.hairClass || ''}"></div>
        </div>
        <div class="fv-viewer-neck"></div>
        <div class="fv-viewer-body"></div>
      </div>
    </div>
  `;

  return `
    <div class="fv-audience-row-1">
      ${row1.map((p, i) => renderSeat(p, i, false)).join('')}
    </div>
    <div class="fv-audience-row-2">
      ${row2.map((p, i) => renderSeat(p, i, true)).join('')}
    </div>
  `;
},

setupTheatreScene(scene, room, video) {
  let yaw = 0;
  let pitch = 0;
  let dragging = false;
  let turned = false;
  let lastX = 0;
  let lastY = 0;

  this.theatreCamera = { yaw: 0, pitch: 0 };

  const applyLook = () => {
    room.style.setProperty('--fv-camera-yaw', `${-yaw.toFixed(2)}deg`);
    room.style.setProperty('--fv-camera-pitch', `${pitch.toFixed(2)}deg`);
  };

  // Pointer drag for full 360Â° rotation
  scene.addEventListener('pointerdown', event => {
    if (event.target.closest('.fv-theatre-screen')) return;
    dragging = true;
    turned = true;
    lastX = event.clientX;
    lastY = event.clientY;
    scene.classList.add('is-dragging');
    scene.setPointerCapture(event.pointerId);
  });

  scene.addEventListener('pointermove', event => {
    if (dragging) {
      yaw += (event.clientX - lastX) * 0.85;
      pitch = Math.max(-24, Math.min(30, pitch - (event.clientY - lastY) * 0.35));
      lastX = event.clientX;
      lastY = event.clientY;
      applyLook();
    } else if (!turned && event.pointerType === 'mouse') {
      const box = scene.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width - 0.5) * 2;
      const y = ((event.clientY - box.top) / box.height - 0.5) * 2;
      yaw = x * 42;
      pitch = -y * 20;
      applyLook();
    }
  });

  const endDrag = () => {
    dragging = false;
    scene.classList.remove('is-dragging');
  };

  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);

  scene.addEventListener('pointerleave', () => {
    if (!turned && !dragging) {
      yaw = 0;
      pitch = 0;
      applyLook();
    }
  });

  // Double click resets view to center screen
  scene.addEventListener('dblclick', () => {
    this.recenterTheatre();
  });

  if (video) {
    video.addEventListener('ended', () => this.stopTheatre());
    video.addEventListener('error', () => {
      // Graceful fallback to working video files
      const fallbacks = ['videos/Way9Dexny3w.mp4', 'videos/a9tq0aS5Zu8.mp4', 'videos/QdBZY2fkU-0.mp4', 'videos/bg.mp4'];
      const current = video.currentSrc || video.src;
      const next = fallbacks.find(f => !current.includes(f));
      if (next && !video.dataset.fbApplied) {
        video.dataset.fbApplied = 'true';
        video.src = next;
        video.play().catch(() => {});
      }
    });
  }
},

setupTrailerSearch(trailers) {
  const input = document.getElementById('fvTrailerQuery');
  const results = document.getElementById('fvTrailerResults');
  const chips = document.getElementById('fvTrendingMovies');
  if (!input || !results) return;

  const playItem = item => {
    this.playTheatre(item.id, true);
    document.getElementById('fvTheatre')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const showResults = () => {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();
    if (!query) return;

    const matches = trailers.filter(item =>
      [item.title, item.franchise, item.category].some(val =>
        String(val || '').toLowerCase().includes(query)
      )
    );

    const heading = document.createElement('p');
    heading.className = 'fv-result-count';
    heading.textContent = matches.length
      ? `${matches.length} trailer${matches.length === 1 ? '' : 's'} ready for cinema`
      : 'No trailer found for this query. Try another keyword.';
    results.appendChild(heading);

    matches.slice(0, 10).forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fv-trailer-result';
      btn.innerHTML = `
        <img src="${item.thumbnail || ''}" alt="" loading="lazy">
        <span>
          <strong>${item.title}</strong>
          <small>${item.category.replace('-', ' ').toUpperCase()} Â· ${item.duration || 'VIDEO'}</small>
        </span>
        <b>PLAY IN CINEMA â–¶</b>
      `;
      btn.addEventListener('click', () => playItem(item));
      results.appendChild(btn);
    });
  };

  input.addEventListener('input', showResults);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const first = results.querySelector('.fv-trailer-result');
      if (first) first.click();
    }
  });

  // Trending movie chips
  if (chips) {
    const popularTitles = ['Dune: Part Two', 'Demon Slayer', 'GTA VI', 'One Piece Egghead', 'Chainsaw Man'];
    chips.innerHTML = popularTitles.map(t => `<button type="button">${t}</button>`).join('');
    chips.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.textContent;
        showResults();
        input.focus();
      });
    });
  }
},

playTheatre(id, autoOpenCurtains = true) {
  const data = window.FANDOM_DATA || {};
  const clip = (data.trailers || []).find(item => item.id === id);
  const theatre = document.getElementById('fvTheatre');
  const video = document.getElementById('fvTheatreVideo');

  if (!clip || !theatre || !video) return;

  // Re-center camera toward center screen
  this.recenterTheatre();

  // Set info
  const titleEl = document.getElementById('fvTheatreTitle');
  if (titleEl) titleEl.textContent = clip.title;
  const hintEl = document.getElementById('fvTheatreHint');
  if (hintEl) hintEl.textContent = `${clip.category.replace('-', ' ').toUpperCase()} Â· ${clip.duration || '4K CINEMA'}`;

  // Update selected pick
  document.querySelectorAll('.fv-theatre-pick').forEach(button => {
    button.classList.toggle('is-selected', button.dataset.theatreId === id);
  });

  const launchPlayback = () => {
    video.pause();
    video.poster = clip.thumbnail || '';
    video.src = `videos/${clip.youtubeId}.mp4`;
    video.load();
    theatre.classList.add('is-playing');

    video.play().catch(() => {
      // If specific file is missing, seamlessly fall back to Dune 2 or available mp4
      const workingFallbacks = ['videos/Way9Dexny3w.mp4', 'videos/a9tq0aS5Zu8.mp4', 'videos/QdBZY2fkU-0.mp4', 'videos/bg.mp4'];
      const fb = workingFallbacks.find(src => !src.includes(clip.youtubeId)) || workingFallbacks[0];
      video.src = fb;
      video.play().catch(() => {});
    });
  };

  // If curtains are currently closed, perform the dramatic opening sequence first!
  if (autoOpenCurtains && !theatre.classList.contains('curtains-open')) {
    this.openCurtains(launchPlayback);
  } else {
    launchPlayback();
  }
},

stopTheatre() {
  const video = document.getElementById('fvTheatreVideo');
  const theatre = document.getElementById('fvTheatre');

  if (video) video.pause();
  if (theatre) {
    theatre.classList.remove('is-playing');
    this.closeCurtains();
  }
},

openCurtains(callback) {
  const theatre = document.getElementById('fvTheatre');
  const btnText = document.getElementById('fvCurtainBtnText');
  const lightText = document.getElementById('fvLightsBtnText');

  if (!theatre) return;

  theatre.classList.add('curtains-open');
  theatre.classList.add('is-lights-dim');
  if (btnText) btnText.textContent = 'Curtains: Open';
  if (lightText) lightText.textContent = 'Lights: Dim';

  // Play realistic cinema harmonic chime
  this.playCinemaChime();

  if (callback) {
    // Curtains transition is 1.35s, trigger playback at 850ms when curtains are mostly open
    setTimeout(callback, 850);
  }
},

closeCurtains() {
  const theatre = document.getElementById('fvTheatre');
  const btnText = document.getElementById('fvCurtainBtnText');
  const lightText = document.getElementById('fvLightsBtnText');

  if (!theatre) return;

  theatre.classList.remove('curtains-open');
  theatre.classList.remove('is-lights-dim');
  if (btnText) btnText.textContent = 'Curtains: Closed';
  if (lightText) lightText.textContent = 'Lights: Hall';
},

toggleCurtains() {
  const theatre = document.getElementById('fvTheatre');
  if (!theatre) return;

  if (theatre.classList.contains('curtains-open')) {
    this.closeCurtains();
  } else {
    this.openCurtains();
  }
},

toggleTheatreLights() {
  const theatre = document.getElementById('fvTheatre');
  const lightText = document.getElementById('fvLightsBtnText');
  if (!theatre) return;

  theatre.classList.toggle('is-lights-dim');
  if (lightText) {
    lightText.textContent = theatre.classList.contains('is-lights-dim') ? 'Lights: Dim' : 'Lights: Hall';
  }
},

toggleCinemaMode() {
  const theatre = document.getElementById('fvTheatre');
  const btn = document.getElementById('fvBtnCinemaMode');
  if (!theatre) return;

  theatre.classList.toggle('is-cinema-mode');
  if (btn) btn.classList.toggle('active', theatre.classList.contains('is-cinema-mode'));
},

recenterTheatre() {
  const room = document.getElementById('fvTheatreRoom');
  if (room) {
    room.style.setProperty('--fv-camera-yaw', '0deg');
    room.style.setProperty('--fv-camera-pitch', '0deg');
  }
},

playCinemaChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    // Elegant warm harmonic cinema chime tones
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch (e) {}
},

injectTheatreStyles() {
  // Styles are permanently bundled in css/style.css
},

  // ==========================================================================
  // 7. DEDICATED EVENTS CALENDAR VIEW
  // ==========================================================================
  renderEvents(statusFilter = 'all') {
    const main = document.getElementById('viewContainer');
    if (!main) return;

    const data = window.FANDOM_DATA || {};
    let list = data.events || [];
    if (statusFilter !== 'all') {
      list = list.filter(e => e.status === statusFilter);
    }

    main.innerHTML = `
      <section class="content-section">
        <div class="container">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h1 class="section-title">Global Fandom Events Calendar</h1>
              <p class="section-subtitle">Track major pop-culture conventions, anime expos, gaming tournaments, and award ceremonies</p>
            </div>
          </div>

          <div class="filter-pills-list" style="margin-bottom: 24px;">
            <button class="filter-pill ${statusFilter === 'all' ? 'active' : ''}" onclick="UI.renderEvents('all')">All Events (${data.events?.length})</button>
            <button class="filter-pill ${statusFilter === 'upcoming' ? 'active' : ''}" onclick="UI.renderEvents('upcoming')">Upcoming Only</button>
            <button class="filter-pill ${statusFilter === 'past' ? 'active' : ''}" onclick="UI.renderEvents('past')">Past Highlights</button>
          </div>

          <div class="grid-2">
            ${list.map(e => this.renderEventCard(e)).join('')}
          </div>
        </div>
      </section>
    `;
  },

  // ==========================================================================
  // 8. DEDICATED MERCHANDISE STORE VIEW
  // ==========================================================================
  renderMerchandise(catFilter = 'all') {
    const main = document.getElementById('viewContainer');
    if (!main) return;

    const data = window.FANDOM_DATA || {};
    let list = data.merchandise || [];
    if (catFilter !== 'all') {
      list = list.filter(m => m.category === catFilter);
    }

    const categories = ['all', 'anime', 'gaming', 'movies', 'tv-shows', 'k-pop', 'comics', 'manga'];

    main.innerHTML = `
      <section class="content-section">
        <div class="container">
          <div class="section-header-row">
            <div class="section-title-wrap">
              <h1 class="section-title">Official Merchandise Showcase</h1>
              <p class="section-subtitle">Browse licensed collectibles, limited apparel, vinyl records, and art prints. Add items to your demo cart.</p>
            </div>
            <button type="button" class="btn-hero-primary" onclick="Cart.open()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              View Cart Drawer
            </button>
          </div>

          <div class="filter-pills-list" style="margin-bottom: 24px;">
            ${categories.map(c => `
              <button class="filter-pill ${c === catFilter ? 'active' : ''}" onclick="UI.renderMerchandise('${c}')">
                ${c.toUpperCase()}
              </button>
            `).join('')}
          </div>

          <div class="grid-3">
            ${list.map(m => this.renderMerchCard(m)).join('')}
          </div>
        </div>
      </section>
    `;
  },

  // ==========================================================================
  // 9. ABOUT US VIEW
  // ==========================================================================
 renderAbout() {
  const main = document.getElementById('viewContainer');
  if (!main) return;

  main.innerHTML = `
    <div class="about-page">
      <section class="content-section about-heading">
      <video class="about-bg-video" autoplay muted loop playsinline aria-hidden="true">
  <source src="videos/bg.mp4" type="video/mp4">
</video>
<div class="about-video-shade" aria-hidden="true"></div>
        <div class="container">
          <div class="about-heading-content">
            <span class="about-overline">ABOUT FANDOMVERSE</span>
         <h1 aria-label="A home for every kind of fan.">
  <span id="aboutTypewriter" aria-hidden="true"></span><span class="about-title-cursor" aria-hidden="true"></span>
</h1>
            <p>
              FandomVerse is an entertainment discovery portal that brings
              stories, characters, updates and fan experiences together
              in one place.
            </p>
            <div class="about-rotating-line" aria-label="Explore stories, characters and fandoms">
  <span class="about-rotating-label">EXPLORE</span>
  <span class="about-rotating-words" aria-hidden="true">
    <span>stories worth sharing.</span>
    <span>characters worth remembering.</span>
    <span>worlds worth discovering.</span>
  </span>
</div>
            <div class="about-heading-meta">
              <span>01 / THE IDEA</span>
              <span>02 / WHAT YOU'LL FIND</span>
              <span>03 / THE PROJECT</span>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section about-section">
        <div class="container about-two-column">
          <div class="about-side-title">
            <span class="about-overline">01 / THE IDEA</span>
            <h2>What is<br>FandomVerse?</h2>
          </div>

          <div class="about-copy">
            <p>
              Fans often visit different websites to read about a series,
              discover characters, watch trailers and keep track of events.
              FandomVerse brings those interests into one organized space.
            </p>
            <p>
              Whether you're following an anime, looking into a new game,
              reading about a movie or discovering your next favorite artist,
              you can explore it here through dedicated fandom categories.
            </p>
            <div class="about-quote">
              <span>âœ¦</span>
              <strong>One universe. Millions of stories.</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section about-section about-section-dark">
        <div class="container">
          <div class="about-section-heading">
            <span class="about-overline">02 / WHAT YOU'LL FIND</span>
            <h2>More than a collection of pages.</h2>
            <p>Everything is arranged to make exploring your interests easier.</p>
          </div>

          <div class="about-feature-grid">
            <article class="about-feature">
              <span class="about-feature-number">01</span>
              <h3>Stories &amp; characters</h3>
              <p>Read articles and explore character profiles across different fandoms.</p>
            </article>

            <article class="about-feature">
              <span class="about-feature-number">02</span>
              <h3>Trailers &amp; media</h3>
              <p>Find trailers, videos, audio content and image galleries in one place.</p>
            </article>

            <article class="about-feature">
              <span class="about-feature-number">03</span>
              <h3>Events &amp; releases</h3>
              <p>Discover highlighted events and see what's coming up in entertainment.</p>
            </article>

            <article class="about-feature">
              <span class="about-feature-number">04</span>
              <h3>Your own collection</h3>
              <p>Save bookmarks, keep session notes and browse the merchandise showcase.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="content-section about-section">
        <div class="container about-two-column">
          <div class="about-side-title">
            <span class="about-overline">THE FANDOMS</span>
            <h2>Seven worlds.<br>One place.</h2>
          </div>

          <div class="about-copy">
            <p>
              FandomVerse covers seven entertainment categories. Each one
              has its own space, so you can go straight to the stories
              that interest you.
            </p>

            <div class="about-category-list">
              <a href="#anime">Anime <span>â†—</span></a>
              <a href="#gaming">Gaming <span>â†—</span></a>
              <a href="#movies">Movies <span>â†—</span></a>
              <a href="#tv-shows">TV Shows <span>â†—</span></a>
              <a href="#k-pop">K-Pop <span>â†—</span></a>
              <a href="#comics">Comics <span>â†—</span></a>
              <a href="#manga">Manga <span>â†—</span></a>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section about-section about-section-dark">
        <div class="container about-two-column">
          <div class="about-side-title">
            <span class="about-overline">03 / THE PROJECT</span>
            <h2>Behind the<br>portal.</h2>
          </div>

          <div class="about-copy">
            <p>
              FandomVerse was developed as a web project for
              <strong>TechWiz 7 â€” The World Tech Championship</strong>
              under the <strong>Fandom Universe</strong> theme and
              <strong>Web Innovation Unleashed</strong> category.
            </p>
            <p>
              The website is a responsive single-page application built
              with HTML, CSS and JavaScript. It uses local content data,
              hash-based navigation and browser storage for features
              such as bookmarks.
            </p>

            <div class="about-project-details">
              <div><span>PROJECT</span><strong>FandomVerse</strong></div>
              <div><span>THEME</span><strong>Fandom Universe</strong></div>
              <div><span>EVENT</span><strong>TechWiz 7</strong></div>
              <div><span>SPECIFICATION</span><strong>Aptech SRS v1.0</strong></div>
            </div>

            <p class="about-disclaimer">
              FandomVerse is an academic demonstration project. Franchise
              names, characters and related media belong to their respective owners.
            </p>
          </div>
        </div>
      </section>
    </div>
  `;
        // About heading: type, pause, delete, repeat
    clearTimeout(this.aboutTypingTimer);

    const titleElement = document.getElementById('aboutTypewriter');
    const titleText = 'A home for every kind of fan.';

    if (titleElement) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        titleElement.textContent = titleText;
      } else {
        let count = 0;
        let deleting = false;

        const animateTitle = () => {
          // About page se nikal jao to animation stop ho jaye
          if (!titleElement.isConnected) return;

          titleElement.textContent = titleText.slice(0, count);

          let delay;

          if (!deleting) {
            if (count < titleText.length) {
              count++;
              delay = 70;
            } else {
              deleting = true;
              delay = 2000; // Poora title 2 seconds dikhega
            }
          } else {
            if (count > 0) {
              count--;
              delay = 38;
            } else {
              deleting = false;
              delay = 450;
            }
          }

          this.aboutTypingTimer = setTimeout(animateTitle, delay);
        };

        animateTitle();
      }
    }
},

  // ==========================================================================
  // 10. CONTACT US VIEW (Interactive form, Google Maps embed, GPS coordinates)
  // ==========================================================================
  renderContact() {
    const main = document.getElementById('viewContainer');
    if (!main) return;

    main.innerHTML = `
      <section class="content-section contact-page">
        <div class="contact-hero">
          <video class="contact-bg-video" autoplay muted loop playsinline aria-hidden="true">
            <source src="videos/QdBZY2fkU-0.mp4" type="video/mp4">
          </video>
          <div class="contact-video-shade" aria-hidden="true"></div>
          <div class="container contact-container">
          <div class="contact-heading">
            <span class="contact-eyebrow">GET IN TOUCH</span>
            <h1 class="contact-title" aria-label="Contact Us"><span id="contactTypewriter" aria-hidden="true"></span><span class="contact-cursor" aria-hidden="true"></span></h1>
            <p class="contact-intro">Have questions, partnership inquiries, or editorial submissions? We'd love to hear from you.</p>
          </div>
          </div>
        </div>

        <div class="container contact-container">
          <div class="contact-grid">
            <!-- Contact Info & Coordinates -->
            <div class="contact-panel">
              <h3 style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 16px;">Headquarters & Community Hub</h3>
              <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
                FandomVerse Digital Entertainment Lab<br>
                Tech Innovation District, Aptech Campus<br>
                Global Media Tower, Suite 404
              </p>

              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="color: var(--accent-gold); font-weight: 700;">Email:</span>
                  <span style="color: var(--text-primary);">editorial@fandomverse-portal.io</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="color: var(--accent-gold); font-weight: 700;">Support:</span>
                  <span style="color: var(--text-primary);">community@fandomverse-portal.io</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="color: var(--accent-gold); font-weight: 700;">GPS Coordinates:</span>
                  <span style="font-family: monospace; color: var(--accent-green); background: var(--bg-card); padding: 2px 6px; border-radius: var(--radius-sm);">34.0522Â° N, 118.2437Â° W</span>
                </div>
              </div>

              <div style="padding: 12px; background: rgba(245, 197, 24, 0.08); border-left: 3px solid var(--accent-gold); border-radius: var(--radius-sm); font-size: 12px; color: var(--text-secondary);">
                <strong>Operating Hours:</strong> 24/7 Global Editorial Coverage â€¢ Community Inquiries Answered within 24 Hours
              </div>
            </div>

            <!-- Interactive Feedback Form -->
            <div class="contact-panel">
              <h3 style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 16px;">Send Us a Message</h3>
              <form id="contactUsForm" onsubmit="UI.handleContactSubmit(event)" style="display: flex; flex-direction: column; gap: 14px;">
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px;">Full Name *</label>
                  <input type="text" required style="width: 100%; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px; color: #fff;" placeholder="Your Name" />
                </div>
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px;">Email Address *</label>
                  <input type="email" required style="width: 100%; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px; color: #fff;" placeholder="name@example.com" />
                </div>
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px;">Fandom Category Interest</label>
                  <select style="width: 100%; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px; color: #fff;">
                    <option>General FandomVerse Inquiry</option>
                    <option>Anime & Manga Editorial</option>
                    <option>Gaming Coverage</option>
                    <option>Movies & TV Shows</option>
                    <option>K-Pop Fan Community</option>
                    <option>Comics Lore & Reviews</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px;">Message *</label>
                  <textarea required rows="4" style="width: 100%; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px; color: #fff; resize: vertical;" placeholder="Your thoughts or questions..."></textarea>
                </div>
                <button type="submit" class="btn-hero-primary" style="margin-top: 4px; justify-content: center;">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>

          <!-- Embedded Google Map Representation -->
          <div class="contact-map-stage">
          <div class="contact-map-card">
            <div style="padding: 14px 20px; border-bottom: 1px solid var(--border-subtle); font-size: 13px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Google Map & GPS Satellite Location (Aptech Global Tech Hub)
            </div>
            <iframe 
              title="FandomVerse Global Location Map"
              width="100%" 
              height="350" 
              style="border:0; filter: invert(90%) hue-rotate(180deg) brightness(85%);" 
              loading="lazy" 
              allowfullscreen 
              src="https://maps.google.com/maps?q=Los%20Angeles%20Convention%20Center&t=&z=13&ie=UTF8&iwloc=&output=embed">
            </iframe>
          </div>
          </div>
        </div>
      </section>
    `;

    clearTimeout(this.contactTypingTimer);
    const contactTitle = document.getElementById('contactTypewriter');
    const contactText = 'Contact Us';

    if (contactTitle) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        contactTitle.textContent = contactText;
      } else {
        let count = 0;
        let deleting = false;
        const animateContactTitle = () => {
          if (!contactTitle.isConnected) return;
          contactTitle.textContent = contactText.slice(0, count);
          let delay;
          if (!deleting) {
            if (count < contactText.length) {
              count++;
              delay = 105;
            } else {
              deleting = true;
              delay = 2100;
            }
          } else if (count > 0) {
            count--;
            delay = 65;
          } else {
            deleting = false;
            delay = 520;
          }
          this.contactTypingTimer = setTimeout(animateContactTitle, delay);
        };
        animateContactTitle();
      }
    }
  },

  handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you! Your message has been received by the FandomVerse editorial desk. (Demo mode submission)');
    e.target.reset();
  },

  // ==========================================================================
  // CARD RENDERERS
  // ==========================================================================
  renderArticleCard(art, highlightTerm = '') {
    const isSaved = window.Bookmarks.isBookmarked(art.id);
    const title = highlightTerm ? window.SearchEngine.highlight(art.title, highlightTerm) : art.title;

    return `
      <article class="card-article" data-id="${art.id}" onclick="UI.openArticleModal('${art.id}')">
        <div class="article-thumb-wrap">
          <img class="article-thumb-img" src="${art.image}" alt="${art.title}" loading="lazy" />
          <span class="card-category-badge">${art.category}</span>
          <button type="button" class="btn-bookmark-card ${isSaved ? 'bookmarked' : ''}" onclick="UI.handleBookmarkClick(event, '${art.id}', 'article')" title="${isSaved ? 'Remove Bookmark' : 'Add to Bookmarks'}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <div class="article-body">
            <div class="article-meta-top">
              <span>${art.date}</span>
              <span>â€¢</span>
              <span>${art.readTime}</span>
            </div>
            <h3 class="article-card-title">${title}</h3>
            <p class="article-card-desc">${art.summary || (art.content ? art.content.substring(0, 110) + '...' : '')}</p>
            <div class="article-card-footer">
              <span>By ${art.author}</span>
              <span class="btn-read-link">Read Article &rarr;</span>
            </div>
          </div>
        </div>
      </article>
    `;
  },


  renderCharacterCard(char, highlightTerm = '') {
    const isSaved = window.Bookmarks.isBookmarked(char.id);
    const name = highlightTerm ? window.SearchEngine.highlight(char.name, highlightTerm) : char.name;

    return `
      <div class="card-character" data-id="${char.id}" onclick="UI.openCharacterModal('${char.id}')">
        <div class="char-thumb-wrap">
          <img class="char-thumb-img" src="${char.image}" alt="${char.name}" loading="lazy" />
          <span class="char-series-badge">${char.series}</span>
          <button type="button" class="btn-bookmark-card ${isSaved ? 'bookmarked' : ''}" onclick="UI.handleBookmarkClick(event, '${char.id}', 'character')" title="${isSaved ? 'Remove Bookmark' : 'Add to Bookmarks'}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <div class="char-preview-badge">
            <span class="char-preview-name">${name}</span>
          </div>
          <div class="char-body">
            <h3 class="char-name">${name}</h3>
            <div class="char-role">${char.role}</div>
            <div class="char-traits-row">
              ${(char.traits || []).slice(0, 3).map(t => `<span class="trait-tag">${t}</span>`).join('')}
            </div>
            <button type="button" class="btn-view-char" onclick="event.stopPropagation(); UI.openCharacterModal('${char.id}')">
              View Dossier &rarr;
            </button>
          </div>
        </div>
      </div>
    `;
  },



  renderTrailerCard(tr, highlightTerm = '') {
    const isUpcoming = tr.releaseStatus === 'upcoming';
    const isPodcast = tr.mediaType === 'podcast';
    const title = highlightTerm ? window.SearchEngine.highlight(tr.title, highlightTerm) : tr.title;

    const clickAction = isPodcast
      ? `UI.playAudioTrack('${tr.id}')`
      : `(document.getElementById('fvTheatre') ? (UI.playTheatre('${tr.id}', true), document.getElementById('fvTheatre').scrollIntoView({behavior: 'smooth', block: 'center'})) : UI.openVideoModal('${tr.id}'))`;

    return `
      <div class="card-trailer" data-id="${tr.id}">
        <div class="trailer-thumb-wrap" onclick="${clickAction}">
          <img class="trailer-thumb-img" src="${tr.thumbnail}" alt="${tr.title}" loading="lazy" />
          <div class="play-overlay-icon">
            ${isPodcast ? `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            ` : `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            `}
          </div>
          <span class="trailer-duration">${tr.duration}</span>
          <span class="trailer-status-tag ${isUpcoming ? 'status-upcoming' : 'status-released'}">
            ${isUpcoming ? 'Upcoming' : 'Released'}
          </span>
          <div class="trailer-body">
            <div class="trailer-type-label">${tr.mediaType} • ${tr.category}</div>
            <h3 class="trailer-title">${title}</h3>
            <div class="trailer-franchise">${tr.franchise}</div>
          </div>
        </div>
      </div>
    `;
  },


  renderEventCard(ev, highlightTerm = '') {
    const isSaved = window.Bookmarks.isBookmarked(ev.id);
    const dateParts = ev.date.split(' ');
    const month = dateParts[0] || 'TBA';
    const day = dateParts[1]?.replace(',', '') || '2026';
    const isUpcoming = ev.status === 'upcoming';
    const title = highlightTerm ? window.SearchEngine.highlight(ev.title, highlightTerm) : ev.title;

    return `
      <div class="card-event" data-id="${ev.id}">
        <div class="event-date-side">
          <span class="event-month">${month}</span>
          <span class="event-day">${day}</span>
          <span class="event-status-badge ${isUpcoming ? 'event-status-upcoming' : 'event-status-past'}">
            ${isUpcoming ? 'Upcoming' : 'Past Event'}
          </span>
        </div>
        <div class="event-main-body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="event-category-tag">${ev.category} â€¢ ${ev.type}</div>
            <button type="button" class="btn-bookmark-card ${isSaved ? 'bookmarked' : ''}" style="position: static;" onclick="UI.handleBookmarkClick(event, '${ev.id}', 'event')" title="Bookmark Event">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
          <h3 class="event-title">${title}</h3>
          <div class="event-venue-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${ev.location}</span>
          </div>
          <p class="event-desc">${ev.description}</p>
          <div class="event-tags-row">
            ${(ev.tags || []).map(t => `<span class="trait-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderMerchCard(m, highlightTerm = '') {
    const title = highlightTerm ? window.SearchEngine.highlight(m.name, highlightTerm) : m.name;

    return `
      <div class="card-merch" data-id="${m.id}">
        <div class="merch-thumb-wrap">
          <img class="merch-thumb-img" src="${m.image}" alt="${m.name}" loading="lazy" />
          ${m.badge ? `<span class="merch-badge">${m.badge}</span>` : ''}
          <div class="merch-body">
            <div class="merch-franchise">${m.franchise} â€¢ ${m.category}</div>
            <h3 class="merch-title">${title}</h3>
            <div class="merch-rating-row">
              <span class="star-rating">â˜… ${m.rating}</span>
              <span>(${m.reviews} reviews)</span>
            </div>
            <div class="merch-price-row">
              <span class="merch-price">$${m.price.toFixed(2)}</span>
              <button type="button" class="btn-add-cart" onclick="event.stopPropagation(); Cart.addItem(${JSON.stringify(m).replace(/"/g, '&quot;')})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },


  renderReleaseCard(r, highlightTerm = '') {
    const title = highlightTerm ? window.SearchEngine.highlight(r.title, highlightTerm) : r.title;

    return `
      <div class="card-release" data-id="${r.id}">
        <div class="release-date-pill">
          <span class="rel-days-badge">${r.daysRemaining ? `${r.daysRemaining} Days` : 'Soon'}</span>
          <div class="rel-date-text">${r.releaseDate}</div>
        </div>
        <div class="release-info-col">
          <span class="release-type-badge">${r.format} â€¢ ${r.category}</span>
          <h4 class="release-title">${title}</h4>
          <div class="release-platform">${r.platform}</div>
        </div>
      </div>
    `;
  },

  handleBookmarkClick(event, id, type) {
    event.stopPropagation();
    const data = window.FANDOM_DATA || {};
    let item = null;

    if (type === 'article') item = data.articles?.find(a => a.id === id);
    else if (type === 'character') item = data.characters?.find(c => c.id === id);
    else if (type === 'event') item = data.events?.find(e => e.id === id);

    if (item) {
      const added = window.Bookmarks.toggle({ ...item, type });
      const btn = event.currentTarget;
      if (btn) {
        btn.classList.toggle('bookmarked', added);
        const svg = btn.querySelector('svg');
        if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
      }
    }
  },

  // ==========================================================================
  // MODALS IMPLEMENTATION
  // ==========================================================================

  // 1. Article Modal
  openArticleModal(id) {
    const data = window.FANDOM_DATA || {};
    const art = data.articles?.find(a => a.id === id);
    if (!art) return;

    const modal = document.getElementById('articleReaderModal');
    const bodyEl = document.getElementById('articleModalBodyContainer');
    if (!modal || !bodyEl) return;

    bodyEl.innerHTML = `
      <div class="article-modal-hero">
        <img src="${art.image}" alt="${art.title}" />
        <div class="article-modal-hero-gradient"></div>
      </div>
      <div class="article-modal-content">
        <div class="article-modal-category">${art.category} â€¢ Feature Article</div>
        <h1 class="article-modal-title">${art.title}</h1>
        <div class="article-modal-byline">
          <span>By <strong>${art.author}</strong></span>
          <span>Published on ${art.date}</span>
          <span>${art.readTime}</span>
        </div>
        <div class="article-modal-body">
          ${art.content.split('\n\n').map((p, idx) => {
            if (idx === 1) {
              return `
                <p>${p}</p>
                <div class="article-pullquote">"${art.subtitle || 'A watershed moment in contemporary fandom history.'}"</div>
              `;
            }
            return `<p>${p}</p>`;
          }).join('')}
        </div>

        <!-- Related Stories Recommendations -->
        <div class="article-related-box">
          <h4>Related Stories from ${art.category.toUpperCase()}</h4>
          <div class="grid-3">
            ${(data.articles || [])
              .filter(a => a.category === art.category && a.id !== art.id)
              .slice(0, 3)
              .map(ra => `
                <div class="card-base" style="cursor: pointer;" onclick="UI.openArticleModal('${ra.id}')">
                  <img src="${ra.image}" alt="${ra.title}" style="aspect-ratio: 16/9; object-fit: cover;" />
                  <div style="padding: 10px;">
                    <h5 style="font-size: 13px; font-weight: 700; color: #fff;">${ra.title}</h5>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // 2. Character Modal
  openCharacterModal(id) {
    const data = window.FANDOM_DATA || {};
    const char = data.characters?.find(c => c.id === id);
    if (!char) return;

    const modal = document.getElementById('characterProfileModal');
    const container = document.getElementById('characterModalContainer');
    if (!modal || !container) return;

    const isSaved = window.Bookmarks.isBookmarked(char.id);

    container.innerHTML = `
      <div class="char-modal-layout">
        <div class="char-modal-portrait-side">
          <img src="${char.image}" alt="${char.name}" />
        </div>
        <div class="char-modal-details-side">
          <div class="char-modal-series">${char.series} â€¢ ${char.category}</div>
          <h2 class="char-modal-name">${char.name}</h2>
          <div class="char-modal-role">${char.role}</div>

          ${char.quote ? `
            <div class="char-quote-box">
              "${char.quote}"
            </div>
          ` : ''}

          <div class="char-modal-bio-title">Biography & Character Lore</div>
          <p class="char-modal-bio">${char.biography}</p>

          <div class="char-modal-traits-title">Key Abilities & Personality Traits</div>
          <div class="char-modal-traits-list">
            ${(char.traits || []).map(t => `<span class="trait-pill-large">${t}</span>`).join('')}
          </div>

          <div class="char-modal-footer">
            <span style="font-size: 13px; color: var(--accent-gold); font-weight: 600;">Popularity Rating: ${char.popularity || 95}%</span>
            <button type="button" class="btn-hero-primary" onclick="UI.handleBookmarkClick(event, '${char.id}', 'character')">
              ${isSaved ? 'â˜… Bookmarked' : 'â˜† Add to Bookmarks'}
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // 3. Video Modal
  openVideoModal(id) {
    const data = window.FANDOM_DATA || {};
    const tr = data.trailers?.find(t => t.id === id);
    if (!tr) return;

    const modal = document.getElementById('videoPlayerModal');
    const frame = document.getElementById('videoPlayerContainer');
    const details = document.getElementById('videoDetailsContainer');
    if (!modal || !frame) return;

    // Local trailer file â€” plays videos/<youtubeId>.mp4, no YouTube embed, no backend needed
    frame.innerHTML = `
      <video controls autoplay playsinline poster="${tr.thumbnail || ''}">
        <source src="videos/${tr.youtubeId}.mp4" type="video/mp4">
      </video>
    `;

    if (details) {
      details.innerHTML = `
        <div class="video-modal-title">${tr.title}</div>
        <p class="video-modal-desc">${tr.description}</p>
      `;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // 4. Play Audio Track
  playAudioTrack(id) {
    const data = window.FANDOM_DATA || {};
    const tr = data.trailers?.find(t => t.id === id);
    if (!tr || !tr.audioUrl) return;

    this.activeAudioTrack = tr;
    this.audioElement.src = tr.audioUrl;
    this.audioElement.play().catch(e => console.log('Audio autoplay prevented', e));

    const dock = document.getElementById('audioBarDock');
    const titleEl = document.getElementById('audioBarTitle');
    const catEl = document.getElementById('audioBarCat');
    const thumbEl = document.getElementById('audioBarThumb');

    if (dock) dock.classList.add('active');
    if (titleEl) titleEl.textContent = tr.title;
    if (catEl) catEl.textContent = `${tr.category.toUpperCase()} Podcast Audio`;
    if (thumbEl) thumbEl.src = tr.thumbnail;

    this.updateAudioPlayIcon(true);
  },

  toggleAudioPlay() {
    if (this.audioElement.paused) {
      this.audioElement.play();
      this.updateAudioPlayIcon(true);
    } else {
      this.audioElement.pause();
      this.updateAudioPlayIcon(false);
    }
  },

  updateAudioPlayIcon(isPlaying) {
    const btn = document.getElementById('audioPlayPauseBtn');
    if (btn) {
      btn.innerHTML = isPlaying ? `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      ` : `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      `;
    }
  },

  setupAudioListeners() {
    this.audioElement.addEventListener('timeupdate', () => {
      const fill = document.getElementById('audioProgressFill');
      const timeEl = document.getElementById('audioTimeDisplay');
      if (this.audioElement.duration) {
        const pct = (this.audioElement.currentTime / this.audioElement.duration) * 100;
        if (fill) fill.style.width = `${pct}%`;
        if (timeEl) {
          const curM = Math.floor(this.audioElement.currentTime / 60);
          const curS = Math.floor(this.audioElement.currentTime % 60).toString().padStart(2, '0');
          const durM = Math.floor(this.audioElement.duration / 60);
          const durS = Math.floor(this.audioElement.duration % 60).toString().padStart(2, '0');
          timeEl.textContent = `${curM}:${curS} / ${durM}:${durS}`;
        }
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.updateAudioPlayIcon(false);
    });
  },

  closeAudioBar() {
    this.audioElement.pause();
    const dock = document.getElementById('audioBarDock');
    if (dock) dock.classList.remove('active');
  },

  // 5. Auth Modal (Dummy Login / Signup per SRS)
  openAuthModal(defaultTab = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    this.switchAuthTab(defaultTab);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  switchAuthTab(tab) {
    const loginTabBtn = document.getElementById('authTabLoginBtn');
    const signupTabBtn = document.getElementById('authTabSignupBtn');
    const loginForm = document.getElementById('authLoginForm');
    const signupForm = document.getElementById('authSignupForm');

    if (tab === 'login') {
      loginTabBtn?.classList.add('active');
      signupTabBtn?.classList.remove('active');
      loginForm?.style.setProperty('display', 'flex');
      signupForm?.style.setProperty('display', 'none');
    } else {
      signupTabBtn?.classList.add('active');
      loginTabBtn?.classList.remove('active');
      signupForm?.style.setProperty('display', 'flex');
      loginForm?.style.setProperty('display', 'none');
    }
  },

  handleAuthSubmit(e, action) {
    e.preventDefault();
    alert(`Success! You are now logged in as a demo FandomVerse member (${action}). Note: Authentication is simulated per SRS requirements.`);
    this.closeAllModals();

    // Show simulated logged in user profile in header
    const loginBtn = document.getElementById('headerLoginBtn');
    const profileBadge = document.getElementById('headerUserProfileBadge');
    if (loginBtn) loginBtn.style.display = 'none';
    if (profileBadge) profileBadge.style.display = 'flex';
  },

  // Close All Active Modals
  closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    this.closeLightbox();
    // Stop video iframe audio
    const videoFrame = document.getElementById('videoPlayerContainer');
    if (videoFrame) videoFrame.innerHTML = '';
    document.body.style.overflow = '';
  },

  renderNotFound() {
    const main = document.getElementById('viewContainer');
    if (main) {
      main.innerHTML = `
        <div class="container" style="text-align: center; padding: 100px 20px;">
          <h1 style="font-size: 48px; color: var(--accent-gold); margin-bottom: 12px;">404</h1>
          <h2 style="font-size: 24px; color: #fff; margin-bottom: 16px;">Fandom Galaxy Not Found</h2>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">The portal dimension you are searching for does not exist.</p>
          <a href="#home" class="btn-hero-primary">Return to FandomVerse Central</a>
        </div>
      `;
    }
  }
};

window.UI = UI;
