# FandomVerse — React + Vite

React conversion of the original vanilla HTML/CSS/JS FandomVerse portal
(`../pics-updated-Final-Html-Backup`). Same design, data and features.

## Run

```bash
npm install
npm run dev      # http://localhost:5200
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Folder structure

```
public/
├── images/                      # local images (referenced as images/...)
└── videos/                      # local trailers, named <youtubeId>.mp4

src/
├── main.jsx                     # entry: providers + global styles
├── App.jsx                      # resolves the hash route, navigation side-effects
│
├── routes/
│   └── routes.jsx               # route table → page element + breadcrumbs + deep links
├── layouts/
│   └── MainLayout.jsx           # header, <main>, drawer, modals, cart, audio, chatbot, footer
│
├── pages/                       # one component per route
│   ├── HomePage.jsx             #   #home
│   ├── CategoryPage.jsx         #   #anime #gaming #movies #tv-shows #k-pop #comics #manga
│   ├── SearchPage.jsx           #   #search?q=...
│   ├── TrailersPage.jsx         #   #trailers
│   ├── EventsPage.jsx           #   #events
│   ├── MerchandisePage.jsx      #   #merch
│   ├── BookmarksPage.jsx        #   #bookmarks
│   ├── AboutPage.jsx            #   #about
│   ├── ContactPage.jsx          #   #contact
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
│   ├── category/                # CategoryHero, CategoryTabContent
│   ├── search/                  # SearchFilters, SearchResultCard
│   ├── bookmarks/               # BookmarkCard (with session notes)
│   ├── contact/                 # ContactInfo, ContactForm, LocationMap
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
│   ├── useHashRoute.js          # parses window.location.hash
│   ├── useGlobalShortcuts.js    # Escape / arrow keys, body scroll lock
│   ├── useScrollReveal.js       # scroll-in animations
│   ├── useTypewriter.js         # typed text (hero titles, ticker)
│   └── useHoverScroll.js        # hover-to-scroll chip strip
│
├── services/                    # plain JS logic, no React
│   ├── searchService.js         # search index, filters, sorting
│   ├── storageService.js        # localStorage/sessionStorage, notes, visitor counter
│   ├── bookmarkExport.js        # bookmarks → .md download
│   ├── notificationService.js   # notify() → toasts
│   └── chatbotEngine.js         # rule-based chatbot matching
│
├── utils/                       # highlight.jsx (search <mark>), format.js
├── constants/                   # index.js, navigation.js, homeContent.js (hero slides, ticker)
├── data/
│   └── fandomData.js            # full dataset: categories, articles, characters, events, ...
└── styles/
    ├── index.css                # imports the files below in order
    ├── style.css                # design tokens, base, layout
    ├── components.css           # cards, modals, cart, chatbot, ...
    ├── responsive.css           # breakpoints + mobile drawer
    ├── hero-slider.css
    └── toast.css
```

### Conventions

- **Pages** only compose components and read data; they hold page-level UI state (filters, tabs).
- **Components** are grouped by feature; one component per file, named like the file.
- **State** shared across the app lives in `context/`; use the hooks `useUI()`, `useBookmarks()`, `useCart()`, `useAudio()`.
- **Services** are framework-free and can be called from anywhere (e.g. `notify({ type, title, message })`).
- Storage keys are unchanged from the HTML version, so saved bookmarks/cart carry over.
