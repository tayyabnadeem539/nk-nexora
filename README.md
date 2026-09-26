# FandomVerse — Portal for Fandom World

> **Academic & Contest Submission**: TechWiz 7 — The World Tech Championship  
> **Theme**: Fandom Universe  
> **Category**: Web Innovation Unleashed  
> **Specification**: Software Requirements Specification (SRS) Version 1.0, Aptech Limited  
> **Architecture**: Responsive Single Page Application (SPA) • Zero-Backend Architecture  

---

## 🌟 Executive Summary
**FandomVerse** is a centralized, high-density entertainment and fandom discovery portal. It unites seven global fan communities into a single cohesive platform:
1. **Anime** (Studio masterpieces, seasonal guides, sakuga analysis)
2. **Gaming** (Next-gen blockbusters, RPG lore, hardware, esports)
3. **Movies** (IMAX epics, auteur cinema, festivals, behind-the-scenes)
4. **TV Shows** (Prestige dramas, streaming phenomena, episode deep-dives)
5. **K-Pop** (Global idol comebacks, choreography, lightstick engineering)
6. **Comics** (Graphic novels, DC/Marvel universes, indie creator rights)
7. **Manga** (Tankobon editions, mangaka retrospectives, serialization)

Designed deliberately to capture the information density, visual hierarchy, and professional polish of real media platforms like **IMDb**, **Crunchyroll**, and **IGN**, FandomVerse strictly avoids artificial AI clichés (no excessive glassmorphism, no fake testimonials, no glowing neon clutter, and no empty 1–2 card sections).

---

## 📊 SRS Compliance Matrix

| Requirement Area | SRS & Prompt Specification | Implementation in FandomVerse |
| :--- | :--- | :--- |
| **Architecture** | SPA, HTML5, CSS3, JavaScript, JSON/local data, no server database | ✅ Pure client-side SPA with hash routing, local JSON store & zero backend |
| **7 Category Hubs** | Dedicated hubs for Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga | ✅ 7 deep hubs with heroes, subgenres, stats, and specialized content |
| **Character Profiles** | Minimum 5 profiles per category with Name, Image, Series, Biography, Traits | ✅ **42 character dossiers** (6 per category) with full profiles, quotes, and traits |
| **Events Highlights** | Minimum 3 events per category with dates, location, category, past/upcoming | ✅ **24 global events** (3-4 per category) with calendar dates, venues, status |
| **Featured Articles** | Long-form news and editorial per category (8-12 recommended) | ✅ **60 in-depth articles** with rich text, pull quotes, bylines, and read times |
| **Trailers & Media** | Embedded videos, interviews, fan content, and podcast audio clips | ✅ **42 media items** with YouTube modal player + interactive audio podcast dock |
| **Image Galleries** | Category galleries with Lightbox/carousel without leaving page | ✅ **42 high-res stills** with keyboard-friendly full-screen Lightbox viewer |
| **Merchandise & Cart** | Showcase with temporary client-side cart, billing calculation, no real checkout | ✅ **14 fan collectibles** + slide-out cart drawer with quantity steppers and demo notice |
| **Rule-Based Chatbot** | Pre-scripted / rule-based FAQ bot, no external AI API, quick-reply chips | ✅ **FandomVerse Guide** floating widget with all 12 SRS questions + keyword matcher |
| **Bookmarking System** | LocalStorage bookmarks, SessionStorage notes, formatted export | ✅ One-click bookmarking, session personal notes editor, and `.md` file export |
| **UI Features** | Real-time clock, simulated visitor counter, breadcrumbs, dummy auth | ✅ Live seconds clock, animated visitor counter, dynamic breadcrumbs, demo login |
| **Responsiveness** | Mobile, tablet, laptop, desktop layouts | ✅ Responsive breakpoints, mobile slide-out drawer, touch-friendly card rows |

---

## 🚀 How to Run the Website (Pure HTML, CSS & JavaScript)

### Instant Browser Launch:
Simply **double-click `index.html`** or right-click `index.html` and choose **Open with** (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, or Safari).

No Node.js, no npm, no command line, and no server setup are required! The website runs 100% locally in any browser.

---

## 📁 Project Directory Structure

```
fandomverse/
├── index.html                  # Single-Page Application shell, navigation, modals, and footer
├── README.md                   # Complete documentation and SRS compliance record
├── css/
│   ├── style.css               # Core design system, dark palette variables, typography, reset
│   ├── components.css          # Content cards, hero carousel, modals, lightbox, cart, chatbot
│   └── responsive.css          # Breakpoints (mobile, tablet, desktop) and mobile drawer
├── js/
│   ├── data.js                 # Embedded zero-dependency dataset fallback
│   ├── router.js               # Hash-based SPA routing (#anime, #gaming, etc.) & breadcrumbs
│   ├── app.js                  # App bootstrap, real-time clock, visitor counter, search dropdown
│   ├── ui.js                   # Dynamic view rendering for all pages, modals, and lightbox
│   ├── search.js               # Global search engine with category/type filters and highlights
│   ├── bookmarks.js            # LocalStorage bookmarks, SessionStorage notes, and export engine
│   ├── cart.js                 # Merchandise cart drawer, quantity updates, and bill calculations
│   └── chatbot.js              # Rule-based / pre-scripted Fandom Guide with FAQ quick-replies
└── data/
    ├── categories.json         # Metadata and hub summaries for all 7 fandoms
    ├── articles.json           # 60 rich editorial articles across all categories
    ├── characters.json         # 42 detailed character profiles (6 per category)
    ├── events.json             # 24 conventions, watch parties, and award shows
    ├── trailers.json           # 42 trailers, interviews, and playable audio tracks
    ├── merchandise.json        # 14 officially licensed fan products
    ├── releases.json           # 16 upcoming release radar entries
    ├── galleries.json          # 42 curated concept stills for category lightboxes
    └── chatbot.json            # Knowledge base intents and pre-scripted FAQ chips
```

---

## 🎨 Visual Identity & Color System

- **Background Core**: `#090A0D` / `#0D0F14` (Deep Charcoal Black)
- **Surface Elevation 1**: `#141720` (Cinematic Slate)
- **Surface Elevation 2**: `#1B1F2B` (Dark Navy-Charcoal Cards)
- **Surface Hover**: `#222737`
- **Primary Accent**: `#F5C518` (Cinema Warm Gold / Amber)
- **Secondary Accent**: `#E50914` (Entertainment Live/Hot Red)
- **Primary Typography**: `#F8F9FA` (Clean Inter font hierarchy)
- **Secondary Typography**: `#9CA3AF` (Muted metadata gray)

---

## 💡 Key Interactive Features

1. **Global Search Engine (`Ctrl + K`)**:
   - Live dropdown autocomplete under the header search bar.
   - Dedicated search view (`#search`) supporting multi-category filter chips, content-type toggles, and sorting (Relevance, Newest, Alphabetical, Popularity).
   - Real-time matched text highlighting.

2. **Rule-Based Fandom Guide Chatbot**:
   - Accessible via the floating star button on every page.
   - Pre-scripted responses for all 12 SRS questions.
   - Natural keyword parsing for typed questions.
   - Embedded direct action buttons (e.g., `[Explore Anime Hub]`, `[Open Cart]`, `[View Events]`).

3. **Merchandise Showcase & Cart Drawer**:
   - Browse collectibles, figurines, and apparel with star ratings and reviews.
   - Add items to the slide-out cart drawer with quantity adjustments (`+` / `-`).
   - Real-time subtotal and total calculations.
   - Prominent notice: *"Demo Cart — Checkout is not available."*

4. **Bookmarks & Session Notes**:
   - Save any article, character, or event card to `localStorage`.
   - Dedicated Bookmarks view (`#bookmarks`) with a built-in session notes editor (`sessionStorage`).
   - One-click export of saved bookmarks with personal notes into a clean Markdown/Text file.

5. **Multimedia & Lightbox**:
   - Embedded YouTube video trailer modal player.
   - Responsive docked bottom audio player for fandom podcasts with playback scrubber.
   - Category image galleries with full-screen Lightbox viewer and keyboard arrow navigation (`Left`, `Right`, `Esc`).

---

## 📜 Disclaimer
Developed for the **TechWiz 7 World Tech Championship** under the theme *Fandom Universe*. All franchise names, characters, images, and trademarks referenced are property of their respective copyright owners and are utilized here strictly for academic, educational, and demonstration purposes.
