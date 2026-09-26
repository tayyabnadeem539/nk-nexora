/* Navigation menus and drawer links (keys map to URLs via routes/paths.js pathFor) */

export const NAV_LINKS = [
  ['home', 'Home'], ['anime', 'Anime'], ['gaming', 'Gaming'], ['movies', 'Movies'],
  ['tv-shows', 'TV Shows'], ['k-pop', 'K-Pop'], ['comics', 'Comics'], ['manga', 'Manga'],
  ['trailers', 'Trailers & Media'], ['events', 'Events'], ['merch', 'Merchandise'],
  ['bookmarks', 'Bookmarks'], ['about', 'About'], ['contact', 'Contact']
];

export const DRAWER_HUB_LINKS = [
  { path: 'home', icon: '🏠', label: 'Home Central' },
  { path: 'anime', icon: '⚔️', label: 'Anime Hub', badge: { text: 'Popular', borderColor: '#ff5722', color: '#ff7043' } },
  { path: 'gaming', icon: '🎮', label: 'Gaming Hub', badge: { text: 'Next-Gen', borderColor: '#4caf50', color: '#66bb6a' } },
  { path: 'movies', icon: '🎬', label: 'Movies Hub', badge: { text: 'Cinema', borderColor: '#e50914', color: '#ef5350' } },
  { path: 'tv-shows', icon: '📺', label: 'TV Shows Hub' },
  { path: 'k-pop', icon: '🎤', label: 'K-Pop Hub' },
  { path: 'comics', icon: '💥', label: 'Comics Hub' },
  { path: 'manga', icon: '📖', label: 'Manga Hub' }
];

export const DRAWER_TOOL_LINKS = [
  { path: 'trailers', icon: '▶', label: 'Trailers & Media Hub', badge: { text: '4K Trailers', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' } },
  { path: 'events', icon: '📅', label: 'Events Calendar' },
  { path: 'merch', icon: '🛍️', label: 'Official Merchandise' },
  { path: 'bookmarks', icon: '🔖', label: 'Saved Bookmarks', bookmarkCount: true },
  { path: 'about', icon: 'ℹ️', label: 'About Us' },
  { path: 'contact', icon: '✉️', label: 'Contact & GPS' }
];

export const FOOTER_HUB_LINKS = [
  ['anime', 'Anime Universe'], ['gaming', 'Gaming Realm'], ['movies', 'Cinematic Hub'],
  ['tv-shows', 'TV Shows & Series'], ['k-pop', 'K-Pop World'], ['comics', 'Comics Multiverse'], ['manga', 'Manga Archives']
];
