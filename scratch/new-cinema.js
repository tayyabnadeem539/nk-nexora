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
              Aggregated multimedia showcases, official announcement trailers, and Photorealistic 360-Degree IMAX Cinema
            </p>
          </div>
        </div>

        <!-- Interactive Trailer Search & Discovery Bar -->
        <div class="fv-trailer-search">
          <label for="fvTrailerQuery">FIND YOUR NEXT TRAILER</label>
          <div class="fv-trailer-search-field">
            <span aria-hidden="true" style="display:flex;align-items:center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c518" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
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
          <!-- 360-DEGREE GRAND IMAX THEATER -->
          <div class="fv-theatre" id="fvTheatre">
            <!-- Cinema Top Bar & Controls HUD -->
            <div class="fv-theatre-top">
              <div class="fv-theatre-brand-row">
                <span class="fv-theatre-label">
                  <i></i> FANDOMVERSE GRAND IMAX 360 THEATER
                </span>
                <span class="fv-theatre-status-pill" id="fvTheatreStatusPill">DOLBY ATMOS 4K</span>
                <span class="fv-theatre-compass" id="fvTheatreCompass">View: Screen (0 deg)</span>
              </div>

              <div class="fv-theatre-toolbar">
                <button type="button" class="fv-theatre-btn" onclick="UI.lookAtAngle(0, 0)" title="Turn to Screen (Front)">
                  <span>Screen (0 deg)</span>
                </button>

                <button type="button" class="fv-theatre-btn" onclick="UI.lookAtAngle(180, 4)" title="Turn to Projection Booth (Rear)">
                  <span>Booth (180 deg)</span>
                </button>

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
                  Close Showtime
                </button>
              </div>
            </div>

            <!-- 360-DEGREE 3D SPATIAL SCENE -->
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
                  <div class="fv-wall-exit-sign">EXIT</div>
                </div>

                <!-- Acoustic Ceiling with Starry Fiber Optics -->
                <div class="fv-theatre-ceiling"></div>

                <!-- Sloped Carpet Floor with Aisle Step Light Runners -->
                <div class="fv-theatre-floor"></div>

                <!-- 180-DEGREE REAR VIEW: Photorealistic Projection Booth & Rear Audience -->
                <div class="fv-theatre-rear-view">
                  <img src="images/cinema-rear.jpg" alt="Cinema Projection Booth" class="fv-theatre-rear-img" />
                  <div class="fv-theatre-rear-overlay">
                    <span class="fv-rear-badge">4K LASER PROJECTION BOOTH - REAR VIP AUDITORIUM</span>
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

                  <!-- Photorealistic Red Velvet Curtains Assembly -->
                  <div class="fv-theatre-curtains" id="fvTheatreCurtains">
                    <div class="fv-curtain-valance">
                      <span class="fv-curtain-valance-title">FANDOMVERSE GRAND CINEMA</span>
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
                    <span>PLAY</span>
                    OPEN CURTAINS & PLAY TRAILER
                  </button>
                </div>

                <!-- Photorealistic Cinema Audience Layer -->
                <div class="fv-theatre-audience" aria-hidden="true">
                  <div class="fv-theatre-audience-real">
                    <img src="images/cinema-audience.jpg" alt="Cinema Audience" class="fv-audience-real-img" />
                  </div>
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
                Drag mouse in any direction for 360-degree view - Click any trailer to open curtains & play
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

                <b>PLAY</b>
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

  // Attach 360-degree interactive look-around & camera tracking with momentum
  const scene = document.getElementById('fvTheatreScene');
  const room = document.getElementById('fvTheatreRoom');
  const video = document.getElementById('fvTheatreVideo');

  if (scene && room) {
    this.setupTheatreScene(scene, room, video);
  }
},

setupTheatreScene(scene, room, video) {
  let yaw = 0;
  let pitch = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let vx = 0;
  let vy = 0;
  let animId = null;

  this.theatreCamera = { yaw: 0, pitch: 0 };

  const updateCompass = () => {
    const compass = document.getElementById('fvTheatreCompass');
    if (!compass) return;
    let norm = ((yaw % 360) + 360) % 360;
    if (norm > 180) norm -= 360;
    const absNorm = Math.abs(norm);
    if (absNorm <= 45) {
      compass.textContent = `View: Screen (${Math.round(norm)} deg)`;
    } else if (absNorm >= 135) {
      compass.textContent = `View: Booth (${Math.round(norm)} deg)`;
    } else if (norm > 45 && norm < 135) {
      compass.textContent = `View: Right Wall (${Math.round(norm)} deg)`;
    } else {
      compass.textContent = `View: Left Wall (${Math.round(norm)} deg)`;
    }
  };

  const applyLook = () => {
    room.style.setProperty('--fv-camera-yaw', `${-yaw.toFixed(2)}deg`);
    room.style.setProperty('--fv-camera-pitch', `${pitch.toFixed(2)}deg`);
    this.theatreCamera.yaw = yaw;
    this.theatreCamera.pitch = pitch;
    updateCompass();
  };

  // Inertia glide animation after release
  const inertiaStep = () => {
    if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05) {
      yaw += vx;
      pitch = Math.max(-35, Math.min(38, pitch + vy));
      vx *= 0.92;
      vy *= 0.92;
      applyLook();
      animId = requestAnimationFrame(inertiaStep);
    }
  };

  // Pointer drag for full 360-degree continuous rotation
  scene.addEventListener('pointerdown', event => {
    if (event.target.closest('.fv-theatre-screen')) return;
    if (animId) cancelAnimationFrame(animId);
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    vx = 0;
    vy = 0;
    scene.classList.add('is-dragging');
    scene.setPointerCapture(event.pointerId);
  });

  scene.addEventListener('pointermove', event => {
    if (dragging) {
      const dx = (event.clientX - lastX) * 0.42;
      const dy = (event.clientY - lastY) * 0.22;
      yaw += dx;
      pitch = Math.max(-35, Math.min(38, pitch - dy));
      vx = dx * 0.65;
      vy = -dy * 0.65;
      lastX = event.clientX;
      lastY = event.clientY;
      applyLook();
    }
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    scene.classList.remove('is-dragging');
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(inertiaStep);
  };

  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);

  // Double click resets view to center screen
  scene.addEventListener('dblclick', () => {
    this.recenterTheatre();
  });

  // Smooth camera orientation transition function
  this.lookAtAngle = (targetYaw, targetPitch = 0) => {
    if (animId) cancelAnimationFrame(animId);
    const startYaw = yaw;
    const startPitch = pitch;
    let diffYaw = ((targetYaw - startYaw) % 360);
    if (diffYaw > 180) diffYaw -= 360;
    if (diffYaw < -180) diffYaw += 360;
    const endYaw = startYaw + diffYaw;
    const duration = 550;
    const startTime = performance.now();

    const animateTransition = now => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      yaw = startYaw + (endYaw - startYaw) * ease;
      pitch = startPitch + (targetPitch - startPitch) * ease;
      applyLook();
      if (progress < 1) {
        requestAnimationFrame(animateTransition);
      }
    };
    requestAnimationFrame(animateTransition);
  };

  if (video) {
    video.addEventListener('ended', () => this.stopTheatre());
    video.addEventListener('error', () => {
      // Graceful fallback to working local video files
      const fallbacks = ['videos/Way9Dexny3w.mp4', 'videos/a9tq0aS5Zu8.mp4', 'videos/QdBZY2fkU-0.mp4', 'videos/bg.mp4'];
      const current = video.currentSrc || video.src;
      const next = fallbacks.find(f => !current.includes(f)) || fallbacks[0];
      if (!video.dataset.fbApplied) {
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
          <small>${item.category.replace('-', ' ').toUpperCase()} - ${item.duration || 'VIDEO'}</small>
        </span>
        <b>PLAY IN CINEMA</b>
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
  this.lookAtAngle(0, 0);

  // Set info
  const titleEl = document.getElementById('fvTheatreTitle');
  if (titleEl) titleEl.textContent = clip.title;
  const hintEl = document.getElementById('fvTheatreHint');
  if (hintEl) hintEl.textContent = `${clip.category.replace('-', ' ').toUpperCase()} - ${clip.duration || '4K CINEMA'}`;

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
    // Curtains transition is 1.4s, trigger playback at 900ms when curtains are mostly open
    setTimeout(callback, 900);
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
  if (this.lookAtAngle) {
    this.lookAtAngle(0, 0);
  } else {
    const room = document.getElementById('fvTheatreRoom');
    if (room) {
      room.style.setProperty('--fv-camera-yaw', '0deg');
      room.style.setProperty('--fv-camera-pitch', '0deg');
    }
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
  // Styles are permanently bundled in css/cinema.css
},
