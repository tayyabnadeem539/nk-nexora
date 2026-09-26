/* Single source of truth for URL paths — use these instead of hard-coded strings. */

export const PATHS = {
  home: '/',
  category: (id) => `/${id}`,
  search: (q) => (q ? `/search?q=${encodeURIComponent(q)}` : '/search'),
  trailers: '/trailers',
  events: '/events',
  merch: '/merch',
  bookmarks: '/bookmarks',
  about: '/about',
  contact: '/contact',
  article: (id) => `/article/${id}`,
  character: (id) => `/character/${id}`
};

/** Menu keys ('home', 'anime', 'trailers', …) → URL path */
export const pathFor = (key) => (key === 'home' ? PATHS.home : `/${key}`);

/**
 * Converts old hash URLs ("#anime", "#search?q=luffy", "#kpop") to paths,
 * so links saved from the HTML version keep working.
 */
export function pathFromLegacyHash(hash) {
  const raw = hash.replace(/^#\/?/, '').trim();
  if (!raw || raw === 'home') return PATHS.home;
  return `/${raw === 'kpop' ? 'k-pop' : raw}`;
}
