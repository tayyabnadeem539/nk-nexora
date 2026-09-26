# FandomVerse — React + Vite

React conversion of the FandomVerse portal (originally vanilla HTML/CSS/JS).
Same design, data and features, with client-side routing by **React Router**.

## Run

```bash
npm install
npm run dev      # http://localhost:5200
npm run build    # production build in dist/
npm run preview  # serve the production build (http://localhost:5200)
```

## Routing

Routes are defined once in `src/routes/routes.jsx` with `createBrowserRouter`; every
page renders inside `MainLayout` through `<Outlet />`.

| URL | Page |
| --- | --- |
| `/` | Home |
| `/anime` `/gaming` `/movies` `/tv-shows` `/k-pop` `/comics` `/manga` | Category hub (`/kpop` redirects to `/k-pop`) |
| `/search?q=luffy` | Global search (query read with `useSearchParams`) |
| `/trailers` `/events` `/merch` `/bookmarks` `/about` `/contact` | Feature pages |
| `/article/:id` `/character/:id` | Home with that article / character dossier open (shareable) |
| anything else | 404 |

- **Links:** use `<Link>` / `<NavLink>` (active menu items get the `active` class automatically) and
  build URLs with `PATHS` from `src/routes/paths.js`, e.g. `PATHS.category('anime')`, `PATHS.search(q)`.
- **Breadcrumbs:** each route declares `handle.crumbs`; `hooks/useBreadcrumbs.js` assembles the trail.
- **On every navigation** (`hooks/useNavigationEffects.js`): open modals and the mobile menu close and
  the page scrolls to the top. Old hash links from the HTML version (`/#events`) redirect to `/events`.
- **Assets** are referenced from the site root (`/images/...`, `/videos/...`, `/audio/...`) so they load on
  nested URLs such as `/article/:id`.

### Deploying

Because URLs are real paths, the host must serve `index.html` for unknown paths (SPA fallback).
`npm run dev` and `npm run preview` already do this. On a static host, add the equivalent rewrite, e.g.

- **Netlify** — `public/_redirects`: `/*  /index.html  200`
- **Vercel** — `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`
- **Apache** — `.htaccess` with `FallbackResource /index.html`

The app is built for the domain root (`base: '/'` in `vite.config.js`); change `base` and pass the same
value as `basename` to `createBrowserRouter` if it is deployed under a sub-path.

## Folder structure

```
public/
├── images/                      # local images → /images/...
├── audio/                       # podcast episodes → /audio/...
└── videos/                      # local trailers, named <youtubeId>.mp4 → /videos/...

src/
├── main.jsx                     # entry: providers + global styles
├── App.jsx                      # <RouterProvider router={router} />
│
├── routes/
│   ├── routes.jsx               # route table (createBrowserRouter) + breadcrumb handles
│   └── paths.js                 # PATHS / pathFor() URL builders, legacy hash conversion
├── layouts/
│   └── MainLayout.jsx           # header, <Outlet />, drawer, modals, cart, audio, chatbot, footer
│
├── pages/                       # one component per route
│   ├── HomePage.jsx             #   /
│   ├── CategoryPage.jsx         #   /anime /gaming /movies /tv-shows /k-pop /comics /manga
│   ├── SearchPage.jsx           #   /search?q=...
│   ├── TrailersPage.jsx         #   /trailers  (Grand IMAX Theater)
│   ├── EventsPage.jsx           #   /events
│   ├── MerchandisePage.jsx      #   /merch
│   ├── BookmarksPage.jsx        #   /bookmarks
│   ├── AboutPage.jsx            #   /about
│   ├── ContactPage.jsx          #   /contact
│   ├── DeepLinkPage.jsx         #   /article/:id  /character/:id
│   ├── NotFoundPage.jsx         #   anything else
│   └── index.js
│
├── components/
│   ├── layout/                  # Header, HeaderSearch, LiveClock, MobileDrawer, Breadcrumbs, Footer, Preloader
│   ├── common/                  # Icons, SectionHeader, ContentSection, FilterPills, Toast, Toaster
│   ├── cards/                   # ArticleCard, CharacterCard, TrailerCard, EventCard, MerchCard, ReleaseCard, BookmarkButton
│   ├── modals/                  # ModalShell, ArticleModal, CharacterModal, VideoModal, AuthModal, ModalRoot
│   ├── gallery/                 # GalleryGrid, Lightbox
│   ├── home/                    # HeroSlider, HeroSlide, HeroTitle, CategoryMarquee, PortalTicker, HubQuickLinks, TrendingStrip
│   ├── theatre/                 # CinemaTheatre, TheatreRoom, TheatreToolbar, TheatrePicks, TrailerSearch, TheatreContext
│   ├── about/                   # AboutHero, AboutSplitSection, AboutFeatureGrid
│   ├── category/                # CategoryHero, CategoryTabContent
│   ├── search/                  # SearchFilters, SearchResultCard
│   ├── bookmarks/               # BookmarkCard (with session notes)
│   ├── contact/                 # ContactHero, ContactInfo, ContactForm, LocationMap
│   ├── cart/                    # CartDrawer, CartItem
│   ├── media/                   # AudioPlayerDock
│   └── chatbot/                 # Chatbot, ChatMessage
│
├── context/                     # app-wide state (React Context)
│   ├── AppProviders.jsx         # composes all providers
│   ├── UIContext.jsx            # modals, lightbox, mobile drawer, chatbot, demo login
│   ├── BookmarksContext.jsx     # bookmarks (localStorage)
│   ├── CartContext.jsx          # demo cart (sessionStorage)
│   └── AudioContext.jsx         # podcast player
│
├── hooks/
│   ├── useBreadcrumbs.js        # breadcrumb trail from the matched routes
│   ├── useNavigationEffects.js  # close overlays + scroll top on navigation, legacy hash redirect
│   ├── useGlobalShortcuts.js    # Escape / arrow keys, body scroll lock
│   ├── useScrollReveal.js       # scroll-in animations
│   ├── useTypewriter.js         # typed text (hero titles, ticker, About/Contact titles)
│   ├── useHoverScroll.js        # hover-to-scroll chip strip
│   ├── useCinemaTheatre.js      # theater state + playback
│   └── useTheatreCamera.js      # theater look-around camera
│
├── services/                    # plain JS logic, no React
│   ├── searchService.js         # search index, filters, sorting
│   ├── storageService.js        # localStorage/sessionStorage, notes
│   ├── bookmarkExport.js        # bookmarks → .md download
│   ├── notificationService.js   # notify() → toasts
│   ├── chatbotEngine.js         # rule-based chatbot matching
│   └── cinemaChime.js           # curtain-open chime (Web Audio)
│
├── utils/                       # highlight.jsx (search <mark>), format.js
├── constants/                   # index.js, navigation.js, homeContent.js, aboutContent.js, cinema.js
├── data/
│   └── fandomData.js            # full dataset: categories, articles, characters, events, ...
└── styles/
    ├── index.css                # imports the files below in order
    ├── style.css                # design tokens, base, layout, About/Contact pages
    ├── components.css           # cards, modals, cart, chatbot, ...
    ├── responsive.css           # breakpoints + mobile drawer
    ├── hero-slider.css
    ├── cinema.css               # Grand IMAX Theater
    └── toast.css
```

### Conventions

- **Pages** only compose components and read data; they hold page-level UI state (filters, tabs).
- **Components** are grouped by feature; one component per file, named like the file.
- **Navigation** always goes through React Router (`<Link>`, `<NavLink>`, `useNavigate`) with `PATHS` — no `href="#..."`.
- **State** shared across the app lives in `context/`; use the hooks `useUI()`, `useBookmarks()`, `useCart()`, `useAudio()`.
- **Services** are framework-free and can be called from anywhere (e.g. `notify({ type, title, message })`).
- Storage keys are unchanged from the HTML version, so saved bookmarks/cart carry over.
