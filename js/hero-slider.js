/**
 * CINEMATIC HERO SLIDER — standalone, dependency-free version
 * Original 3D tilt slide transition + auto-play + trailer sider, extracted
 * from the FandomVerse project and cleaned up so it can be dropped into
 * any site.
 *
 * HOW TO USE
 * 1. Include hero-slider.css on the page.
 * 2. Put an empty container in your HTML:  <div id="heroSliderRoot"></div>
 * 3. Edit the HERO_SLIDES array below with your own slides.
 * 4. Include this file with <script src="hero-slider.js"></script>
 *    (or paste it before </body>) — it renders itself automatically.
 */

// ---- 1. EDIT YOUR SLIDES HERE ----------------------------------------
const HERO_SLIDES = [
  {
    tag: "Anime Milestone",
    type: "Feature Story",
    title: "One Piece: Sun God Nika and 25 Years of Foreshadowing",
    desc: "Tracing the legendary thematic journey of Monkey D. Luffy from East Blue to the monumental Gear 5 awakening atop Onigashima.",
    image: "images/onepiece-bg.png",
    route: "#anime",
    articleId: "art-anime-2",
    trailerTitle: "One Piece Episode 1100: Egghead Island Climax Trailer",
    youtubeId: "Jb_Z-3d6D8U",
    duration: "1:55"
  },
  {
    tag: "Next-Gen Gaming",
    type: "Netflix Exclusive",
    title: "Grand Theft Auto VI: Extended Edition – Neon Horizons of Vice City",
    desc: "An extended, uncut look at Rockstar Games' groundbreaking dynamic crowd systems, atmospheric weather, and generational open-world simulation — exclusive Netflix cut.",
    image: "images/gta-bg.png",
    route: "#gaming",
    articleId: "art-gaming-2",
    trailerTitle: "Grand Theft Auto VI – Netflix Extended Trailer",
    youtubeId: "QdBZY2fkU-0",
    duration: "2:10"
  },
  {
    tag: "Cinematic Masterpiece",
    type: "IMAX Spotlight",
    title: "Dune: Part Two and the Triumphant Power of 70mm Celluloid",
    desc: "How Denis Villeneuve and Hans Zimmer constructed an uncompromised sensory spectacle that revitalized the theatrical experience.",
    image: "images/dune-bg.png",
    route: "#movies",
    articleId: "art-movies-1",
    trailerTitle: "Dune: Part Two – Official Theatrical IMAX Trailer",
    youtubeId: "Way9Dexny3w",
    duration: "3:40"
  },
  {
    tag: "Theatrical Anime Event",
    type: "Official Trailer",
    title: "Demon Slayer: Infinity Castle Arc – The Final Battle Begins",
    desc: "Ufotable delivers the definitive cinematic spectacle inside Muzan's shifting Infinity Castle with boundary-pushing sakuga animation.",
    image: "images/demonslayer-bg.png",
    route: "#anime",
    articleId: "art-anime-1",
    trailerTitle: "Demon Slayer: Infinity Castle Arc – Official Announcement Trailer",
    youtubeId: "a9tq0aS5Zu8",
    duration: "2:30"
  }
];
// -----------------------------------------------------------------------

const HeroSlider = {
  root: null,
  slides: [],
  activeIndex: 0,
  timer: null,

  // Local trailer files live in /videos and must be named "<youtubeId>.mp4"
  // (e.g. videos/Way9Dexny3w.mp4). Swap in your own downloaded trailer here —
  // no YouTube embed, no backend, just a static file next to index.html.
  trailerScreenHTML(slide, idx) {
    return `
      <video class="hero-trailer-iframe" id="heroVideo_${idx}" poster="${slide.image}" controls preload="none" playsinline>
        <source src="videos/${slide.youtubeId}.mp4" type="video/mp4">
      </video>
    `;
  },

  init(containerId, slides) {
    this.root = document.getElementById(containerId);
    if (!this.root) return;
    this.slides = slides || HERO_SLIDES;
    if (this.timer) clearInterval(this.timer);
    this.activeIndex = 0;
    this.render();
    this.startTimer();
    this.setupSwipe();
  },

  render() {
    const slides = this.slides;
    this.root.innerHTML = `
      <section class="hero-cinematic-wrap" id="homeHeroSlider" onmouseenter="HeroSlider.pauseTimer()" onmouseleave="HeroSlider.startTimer()">
        ${slides.map((slide, idx) => `
          <div class="hero-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
            <img class="hero-backdrop-img" src="${slide.image}" alt="${slide.title}" />
            <div class="hero-gradient-overlay"></div>
            <div class="container hero-content-container">
              <div class="hero-split-layout">
                <div class="hero-content-col">
                  <div class="hero-badge-row">
                    <span class="hero-tag">${slide.tag}</span>
                    <span class="hero-meta-pill">${slide.type}</span>
                  </div>
                  <h1 class="hero-title" id="heroTitle_${idx}"><span class="hero-title-typed"></span><span class="hero-title-cursor">|</span></h1>
                  <p class="hero-description">${slide.desc}</p>
                  <div class="hero-cta-group">
                    <button type="button" class="btn-hero-primary" onclick="HeroSlider.playTrailer(${idx})" aria-label="Watch Full Trailer">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
                      Watch Trailer
                    </button>
                    <a href="${slide.route}" class="btn-hero-secondary"${slide.articleId ? ` onclick="if(window.UI){UI.openArticleModal('${slide.articleId}');return false;}"` : ''}>
                      Read Full Feature
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                    <a href="${slide.route}" class="btn-hero-ghost">
                      Explore Hub
                    </a>
                  </div>
                </div>

                <div class="hero-trailer-sider">
                  <div class="trailer-sider-card">
                    <div class="trailer-sider-header">
                      <div class="trailer-sider-badge">
                        <span class="trailer-live-pulse"></span>
                        <span>OFFICIAL TRAILER</span>
                      </div>
                      <span class="trailer-sider-duration">${slide.duration}</span>
                    </div>
                    <div class="trailer-sider-screen" id="heroTrailerScreen_${idx}">
                      ${this.trailerScreenHTML(slide, idx)}
                    </div>
                    <div class="trailer-sider-footer">
                      <div class="trailer-sider-title-wrap">
                        <div class="trailer-sider-title">${slide.trailerTitle}</div>
                      </div>
                      <button type="button" class="trailer-cinema-btn" onclick="HeroSlider.cinemaMode(${idx})" title="Watch in Full Cinema Mode with Sound">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        <span>Cinema Mode</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}

        <button type="button" class="hero-arrow-btn hero-arrow-prev" onclick="HeroSlider.shift(-1)" aria-label="Previous slide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button type="button" class="hero-arrow-btn hero-arrow-next" onclick="HeroSlider.shift(1)" aria-label="Next slide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        <div class="hero-control-bar">
          <span class="hero-slide-counter"><span class="current" id="heroSlideCounterCurrent">01</span> / ${String(slides.length).padStart(2, '0')}</span>
          <div class="hero-slider-nav">
            ${slides.map((_, idx) => `
              <div class="hero-dot ${idx === 0 ? 'active' : ''}" onclick="HeroSlider.switchTo(${idx})">
                <span class="hero-dot-progress"></span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;

    this.typeTitle(this.activeIndex);
  },

  // Types out the active slide's title character-by-character with a
  // blinking cursor (.hero-title-cursor, styled in hero-slider.css).
  typeTitle(idx) {
    if (this._typeTimeout) clearTimeout(this._typeTimeout);

    const slide = this.slides[idx];
    const typedEl = document.querySelector(`#heroTitle_${idx} .hero-title-typed`);
    if (!slide || !typedEl) return;

    const text = slide.title;
    let charIdx = 0;
    typedEl.textContent = '';

    const tick = () => {
      const liveEl = document.querySelector(`#heroTitle_${idx} .hero-title-typed`);
      if (!liveEl) return;
      charIdx++;
      liveEl.textContent = text.substring(0, charIdx);
      if (charIdx < text.length) {
        this._typeTimeout = setTimeout(tick, 28);
      }
    };
    tick();
  },

  playTrailer(idx) {
    this.pauseTimer();
    const video = document.getElementById(`heroVideo_${idx}`);
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
  },

  cinemaMode(idx) {
    this.pauseTimer();
    const video = document.getElementById(`heroVideo_${idx}`);
    if (!video) return;
    video.muted = false;
    if (video.requestFullscreen) video.requestFullscreen().catch(() => {});
    video.play().catch(() => {});
  },

  setupSwipe() {
    const wrap = document.getElementById('homeHeroSlider');
    if (!wrap || wrap.dataset.swipeBound) return;
    wrap.dataset.swipeBound = 'true';
    let startX = 0;
    let tracking = false;

    wrap.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      tracking = true;
    }, { passive: true });

    wrap.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const deltaX = e.changedTouches[0].clientX - startX;
      if (Math.abs(deltaX) < 45) return;
      this.shift(deltaX < 0 ? 1 : -1);
    }, { passive: true });
  },

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      const slides = document.querySelectorAll('.hero-slide');
      if (!slides.length) return;
      const next = (this.activeIndex + 1) % slides.length;
      this.switchTo(next);
    }, 4000);
  },

  pauseTimer() {
    if (this.timer) clearInterval(this.timer);
  },

  shift(delta) {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    const next = (this.activeIndex + delta + slides.length) % slides.length;
    this.switchTo(next, delta > 0 ? 'next' : 'prev');
    this.startTimer();
  },

  switchTo(index, direction) {
    if (index === this.activeIndex) return;
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    if (!direction) {
      const forwardDist = (index - this.activeIndex + slides.length) % slides.length;
      direction = forwardDist <= slides.length / 2 ? 'next' : 'prev';
    }
    const prevIndex = this.activeIndex;
    const incoming = slides[index];
    const outgoing = slides[prevIndex];
    this.activeIndex = index;

    slides.forEach(s => s.classList.remove('leaving', 'pre-enter', 'dir-next', 'dir-prev', 'active'));

    incoming.classList.add('pre-enter', direction === 'next' ? 'dir-next' : 'dir-prev');
    outgoing.classList.add('leaving', direction === 'next' ? 'dir-next' : 'dir-prev');
    void incoming.offsetWidth;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        incoming.classList.remove('pre-enter');
        incoming.classList.add('active');
      });
    });

    clearTimeout(this._cleanupTimer);
    this._cleanupTimer = setTimeout(() => {
      slides.forEach(s => {
        if (s !== incoming) s.classList.remove('leaving', 'dir-next', 'dir-prev');
      });
    }, 950);

    // Reset the trailer player for every slide (local <video>, no embeds)
    const slidesList = this.slides || [];
    slides.forEach((slide, sIdx) => {
      const screen = document.getElementById(`heroTrailerScreen_${sIdx}`);
      const slideData = slidesList[sIdx];
      if (!screen || !slideData) return;
      screen.innerHTML = this.trailerScreenHTML(slideData, sIdx);
    });

    const dots = document.querySelectorAll('.hero-dot');
    dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
    const counterEl = document.getElementById('heroSlideCounterCurrent');
    if (counterEl) counterEl.textContent = String(index + 1).padStart(2, '0');

    this.typeTitle(index);
  }
};

// Auto-init if a #heroSliderRoot element exists on the page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('heroSliderRoot')) {
    HeroSlider.init('heroSliderRoot', HERO_SLIDES);
  }
});