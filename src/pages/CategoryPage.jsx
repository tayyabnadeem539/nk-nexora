import { useMemo, useState } from 'react';
import FANDOM_DATA from '../data/fandomData.js';
import CategoryHero from '../components/category/CategoryHero.jsx';
import CategoryTabContent, { ArticleGrid } from '../components/category/CategoryTabContent.jsx';
import FilterPills from '../components/common/FilterPills.jsx';
import NotFoundPage from './NotFoundPage.jsx';

const byCategory = (list, id) => (list || []).filter(item => item.category === id);

function sortArticles(list, sortType) {
  const sorted = [...list];
  if (sortType === 'alpha') sorted.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortType === 'popular') sorted.sort((a, b) => parseInt(b.readTime || '5') - parseInt(a.readTime || '5'));
  else sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted;
}

export default function CategoryPage({ categoryId }) {
  const [tab, setTab] = useState('all');
  // Picking a sort order swaps the tab area for a sorted article grid (original behaviour)
  const [sortType, setSortType] = useState(null);

  const category = FANDOM_DATA.categories?.find(c => c.id === categoryId);

  const content = useMemo(() => ({
    articles: byCategory(FANDOM_DATA.articles, categoryId),
    characters: byCategory(FANDOM_DATA.characters, categoryId),
    trailers: byCategory(FANDOM_DATA.trailers, categoryId),
    events: byCategory(FANDOM_DATA.events, categoryId),
    merch: byCategory(FANDOM_DATA.merchandise, categoryId),
    releases: byCategory(FANDOM_DATA.releases, categoryId),
    gallery: FANDOM_DATA.galleries?.[categoryId] || []
  }), [categoryId]);

  if (!category) return <NotFoundPage />;

  const tabs = [
    ['all', 'All Content'],
    ['articles', `Articles (${content.articles.length})`],
    ['characters', `Characters (${content.characters.length})`],
    ['media', `Trailers & Audio (${content.trailers.length})`],
    ['gallery', `Image Gallery (${content.gallery.length})`],
    ['events', `Events (${content.events.length})`],
    ['merch', `Merchandise (${content.merch.length})`]
  ];

  const stats = [
    [content.articles.length, 'Articles'],
    [content.characters.length, 'Characters'],
    [content.trailers.length, 'Media Clips'],
    [content.gallery.length, 'Gallery Stills']
  ];

  const selectTab = (next) => {
    setTab(next);
    setSortType(null);
  };

  return (
    <>
      <CategoryHero category={category} stats={stats} />

      <section className="content-section" style={{ padding: '16px 0' }}>
        <div className="container">
          <div className="filter-bar-wrap">
            <FilterPills options={tabs} value={tab} onChange={selectTab} style={null} />

            <div className="sort-select-wrap">
              <label htmlFor="catSortSelect">Sort By:</label>
              <select id="catSortSelect" className="custom-select" value={sortType || 'newest'} onChange={(e) => setSortType(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="alpha">Alphabetical (A-Z)</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          <div id="categoryTabContainer">
            {sortType
              ? <ArticleGrid items={sortArticles(content.articles, sortType)} />
              : <CategoryTabContent categoryId={categoryId} tab={tab} content={content} />}
          </div>
        </div>
      </section>
    </>
  );
}
