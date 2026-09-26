/* App-wide constants */

export const FILTER_CATEGORIES = ['all', 'anime', 'gaming', 'movies', 'tv-shows', 'k-pop', 'comics', 'manga'];

export const SEARCH_TYPES = ['all', 'article', 'character', 'trailer', 'event', 'merchandise', 'release'];

export const CATEGORY_HUB_NAMES = {
  'anime': 'Anime Hub',
  'gaming': 'Gaming Hub',
  'movies': 'Movies Hub',
  'tv-shows': 'TV Shows Hub',
  'k-pop': 'K-Pop Hub',
  'kpop': 'K-Pop Hub',
  'comics': 'Comics Hub',
  'manga': 'Manga Hub'
};

export const FALLBACK_MERCH_IMAGE = 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80';
export const FALLBACK_AUDIO_THUMB = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80';

/** Local trailer files live in public/videos and are named <youtubeId>.mp4 */
export const videoSrc = (youtubeId) => `videos/${youtubeId}.mp4`;
