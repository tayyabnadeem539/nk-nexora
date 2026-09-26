import { useEffect, useState } from 'react';
import SearchFilters from '../components/search/SearchFilters.jsx';
import SearchResultCard from '../components/search/SearchResultCard.jsx';
import { searchQuery } from '../services/searchService.js';

// Filters persist between visits to the search page
let savedFilters = { category: 'all', type: 'all', sort: 'relevance' };

function NoResults() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 8 }}>No matching results found</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto' }}>Try adjusting your search terms, clearing category filters, or selecting 'All' content types.</p>
    </div>
  );
}

export default function SearchPage({ initialTerm = '' }) {
  const [term, setTerm] = useState(initialTerm);
  const [filters, setFilters] = useState(savedFilters);

  useEffect(() => { setTerm(initialTerm); }, [initialTerm]);
  useEffect(() => { savedFilters = filters; }, [filters]);

  const results = searchQuery(term, filters);

  return (
    <section className="content-section">
      <div className="container">
        <div className="section-title-wrap" style={{ marginBottom: 24 }}>
          <h1 className="section-title">Global Fandom Search</h1>
          <p className="section-subtitle">Real-time search across all 7 categories, articles, characters, trailers, events, and merchandise</p>
        </div>

        <SearchFilters
          term={term}
          onTermChange={setTerm}
          filters={filters}
          onFilterChange={setFilters}
          resultCount={results.length}
        />

        {results.length === 0 ? <NoResults /> : (
          <div className="grid-4">
            {results.map(item => <SearchResultCard key={`${item.type}-${item.id}`} item={item} term={term} />)}
          </div>
        )}
      </div>
    </section>
  );
}
