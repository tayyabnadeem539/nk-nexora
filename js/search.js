/**
 * FandomVerse - Global Client-Side Search System
 * Searches across: Articles, Characters, Trailers/Media, Events, Merchandise, Releases
 * Features:
 * - Multi-category and content-type filtering
 * - Sorting: Relevance, Alphabetical (A-Z), Newest, Popularity
 * - Highlight matching query terms
 * - Header quick dropdown + full dedicated search view
 */

const SearchEngine = {
  // Normalize and build unified search index from window.FANDOM_DATA
  getIndex() {
    const data = window.FANDOM_DATA || {};
    const items = [];

    // 1. Articles
    (data.articles || []).forEach(a => {
      items.push({
        id: a.id,
        type: 'article',
        typeLabel: 'Article',
        title: a.title,
        subtitle: a.subtitle || '',
        category: a.category,
        image: a.image,
        description: a.summary || (a.content ? a.content.substring(0, 160) + '...' : ''),
        date: a.date,
        popularity: a.readTime ? parseInt(a.readTime) : 5,
        tags: a.tags || [],
        rawItem: a
      });
    });

    // 2. Characters
    (data.characters || []).forEach(c => {
      items.push({
        id: c.id,
        type: 'character',
        typeLabel: 'Character Profile',
        title: c.name,
        subtitle: `${c.series} • ${c.role}`,
        category: c.category,
        image: c.image,
        description: c.biography.substring(0, 160) + '...',
        date: '2026-01-01',
        popularity: c.popularity || 90,
        tags: c.traits || [],
        rawItem: c
      });
    });

    // 3. Trailers & Media
    (data.trailers || []).forEach(t => {
      items.push({
        id: t.id,
        type: 'trailer',
        typeLabel: t.mediaType.toUpperCase(),
        title: t.title,
        subtitle: `${t.franchise} • ${t.duration}`,
        category: t.category,
        image: t.thumbnail,
        description: t.description,
        date: '2026-09-01',
        popularity: 80,
        tags: [t.mediaType, t.releaseStatus],
        rawItem: t
      });
    });

    // 4. Events
    (data.events || []).forEach(e => {
      items.push({
        id: e.id,
        type: 'event',
        typeLabel: `${e.type} Event`,
        title: e.title,
        subtitle: `${e.date} • ${e.location}`,
        category: e.category,
        image: e.image,
        description: e.description,
        date: e.date,
        popularity: 75,
        tags: e.tags || [],
        rawItem: e
      });
    });

    // 5. Merchandise
    (data.merchandise || []).forEach(m => {
      items.push({
        id: m.id,
        type: 'merchandise',
        typeLabel: 'Fan Merchandise',
        title: m.name,
        subtitle: `${m.franchise} • $${m.price.toFixed(2)}`,
        category: m.category,
        image: m.image,
        description: m.description,
        date: '2026-08-01',
        popularity: Math.round(m.rating * 20),
        tags: [m.badge || '', m.franchise],
        rawItem: m
      });
    });

    // 6. Releases
    (data.releases || []).forEach(r => {
      items.push({
        id: r.id,
        type: 'release',
        typeLabel: 'Upcoming Release',
        title: r.title,
        subtitle: `${r.format} • ${r.platform}`,
        category: r.category,
        image: r.image,
        description: `Scheduled release for ${r.releaseDate}. Status: ${r.status}.`,
        date: r.releaseDate,
        popularity: 70,
        tags: [r.format, r.platform],
        rawItem: r
      });
    });

    return items;
  },

  query(searchTerm = '', filters = {}) {
    const term = searchTerm.trim().toLowerCase();
    const category = filters.category || 'all';
    const type = filters.type || 'all';
    const sort = filters.sort || 'relevance';

    let list = this.getIndex();

    // 1. Text Search Filter
    if (term) {
      list = list.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(term);
        const descMatch = item.description.toLowerCase().includes(term);
        const subMatch = item.subtitle.toLowerCase().includes(term);
        const catMatch = item.category.toLowerCase().includes(term);
        const tagMatch = item.tags.some(t => t.toLowerCase().includes(term));
        return titleMatch || descMatch || subMatch || catMatch || tagMatch;
      });
    }

    // 2. Category Filter
    if (category !== 'all') {
      list = list.filter(item => item.category === category);
    }

    // 3. Type Filter
    if (type !== 'all') {
      list = list.filter(item => item.type === type);
    }

    // 4. Sorting
    if (sort === 'alpha') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'popular') {
      list.sort((a, b) => b.popularity - a.popularity);
    } else if (sort === 'newest') {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      // Relevance: Exact title match first, then description
      if (term) {
        list.sort((a, b) => {
          const aTitle = a.title.toLowerCase().includes(term) ? 1 : 0;
          const bTitle = b.title.toLowerCase().includes(term) ? 1 : 0;
          return bTitle - aTitle;
        });
      }
    }

    return list;
  },

  highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(245, 197, 24, 0.35); color: #fff; padding: 1px 3px; border-radius: 2px;">$1</mark>');
  }
};

window.SearchEngine = SearchEngine;
