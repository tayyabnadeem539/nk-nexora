/**
 * Global client-side search across Articles, Characters, Trailers/Media,
 * Events, Merchandise and Releases — with category/type filters and sorting.
 */
import FANDOM_DATA from '../data/fandomData.js';

function buildIndex(data) {
  const items = [];

  (data.articles || []).forEach(a => items.push({
    id: a.id, type: 'article', typeLabel: 'Article',
    title: a.title, subtitle: a.subtitle || '', category: a.category, image: a.image,
    description: a.summary || (a.content ? a.content.substring(0, 160) + '...' : ''),
    date: a.date, popularity: a.readTime ? parseInt(a.readTime) : 5,
    tags: a.tags || [], rawItem: a
  }));

  (data.characters || []).forEach(c => items.push({
    id: c.id, type: 'character', typeLabel: 'Character Profile',
    title: c.name, subtitle: `${c.series} • ${c.role}`, category: c.category, image: c.image,
    description: c.biography.substring(0, 160) + '...',
    date: '2026-01-01', popularity: c.popularity || 90,
    tags: c.traits || [], rawItem: c
  }));

  (data.trailers || []).forEach(t => items.push({
    id: t.id, type: 'trailer', typeLabel: t.mediaType.toUpperCase(),
    title: t.title, subtitle: `${t.franchise} • ${t.duration}`, category: t.category, image: t.thumbnail,
    description: t.description, date: '2026-09-01', popularity: 80,
    tags: [t.mediaType, t.releaseStatus], rawItem: t
  }));

  (data.events || []).forEach(e => items.push({
    id: e.id, type: 'event', typeLabel: `${e.type} Event`,
    title: e.title, subtitle: `${e.date} • ${e.location}`, category: e.category, image: e.image,
    description: e.description, date: e.date, popularity: 75,
    tags: e.tags || [], rawItem: e
  }));

  (data.merchandise || []).forEach(m => items.push({
    id: m.id, type: 'merchandise', typeLabel: 'Fan Merchandise',
    title: m.name, subtitle: `${m.franchise} • $${m.price.toFixed(2)}`, category: m.category, image: m.image,
    description: m.description, date: '2026-08-01', popularity: Math.round(m.rating * 20),
    tags: [m.badge || '', m.franchise], rawItem: m
  }));

  (data.releases || []).forEach(r => items.push({
    id: r.id, type: 'release', typeLabel: 'Upcoming Release',
    title: r.title, subtitle: `${r.format} • ${r.platform}`, category: r.category, image: r.image,
    description: `Scheduled release for ${r.releaseDate}. Status: ${r.status}.`,
    date: r.releaseDate, popularity: 70,
    tags: [r.format, r.platform], rawItem: r
  }));

  return items;
}

const INDEX = buildIndex(FANDOM_DATA);

export function searchQuery(searchTerm = '', filters = {}) {
  const term = searchTerm.trim().toLowerCase();
  const { category = 'all', type = 'all', sort = 'relevance' } = filters;

  let list = [...INDEX];

  if (term) {
    list = list.filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.subtitle.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.tags.some(t => t.toLowerCase().includes(term))
    );
  }

  if (category !== 'all') list = list.filter(item => item.category === category);
  if (type !== 'all') list = list.filter(item => item.type === type);

  if (sort === 'alpha') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'popular') {
    list.sort((a, b) => b.popularity - a.popularity);
  } else if (sort === 'newest') {
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (term) {
    // Relevance: title matches first
    list.sort((a, b) => (b.title.toLowerCase().includes(term) ? 1 : 0) - (a.title.toLowerCase().includes(term) ? 1 : 0));
  }

  return list;
}
