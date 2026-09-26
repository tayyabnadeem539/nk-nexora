/* Grand IMAX Theater (Trailers page) settings */

/** Trailers whose mp4 ships in public/videos — listed first so playback works immediately. */
export const LOCAL_VIDEO_IDS = ['Way9Dexny3w', 'a9tq0aS5Zu8', 'QdBZY2fkU-0', 'Jb_Z-3d6D8U'];

/** Played instead when a trailer's own file is missing. */
export const FALLBACK_VIDEO_SRCS = ['videos/Way9Dexny3w.mp4', 'videos/a9tq0aS5Zu8.mp4', 'videos/QdBZY2fkU-0.mp4', 'videos/bg.mp4'];

/** Quick-search chips under the trailer search box. */
export const POPULAR_CINEMA_TITLES = ['Dune: Part Two', 'Demon Slayer', 'GTA VI', 'One Piece Egghead', 'Chainsaw Man'];

export const DEFAULT_THEATRE_HINT = 'Move mouse to look · Drag for 360° · Click any trailer to open curtains & play';

/** Curtains animate for ~1.35s; playback starts once they are mostly open. */
export const CURTAIN_PLAY_DELAY_MS = 850;

/** "tv-shows" → "TV SHOWS" */
export const categoryLabel = (category) => category.replace('-', ' ').toUpperCase();
