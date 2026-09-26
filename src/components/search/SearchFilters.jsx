import { FILTER_CATEGORIES, SEARCH_TYPES } from '../../constants/index.js';
import FilterPills from '../common/FilterPills.jsx';

const labelStyle = { fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' };
const rowStyle = { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' };

/** Search box + category / content-type pills + sort select + result count. */
export default function SearchFilters({ term, onTermChange, filters, onFilterChange, resultCount }) {
  const set = (key) => (value) => onFilterChange({ ...filters, [key]: value });

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 30 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          className="header-search-input"
          value={term}
          onChange={(e) => onTermChange(e.target.value)}
          placeholder="Search for characters, franchises, trailers, conventions..."
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '12px 18px', borderRadius: 'var(--radius-md)', fontSize: 16, width: '100%', color: '#fff' }}
        />
        <button type="button" className="btn-hero-primary" style={{ whiteSpace: 'nowrap' }}>Search</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={rowStyle}>
          <span style={labelStyle}>Category:</span>
          <FilterPills options={FILTER_CATEGORIES} value={filters.category} onChange={set('category')} style={{ display: 'contents' }} />
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>Content Type:</span>
          <FilterPills options={SEARCH_TYPES} value={filters.type} onChange={set('type')} style={{ display: 'contents' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
          <span style={labelStyle}>Sort Order:</span>
          <select className="custom-select" value={filters.sort} onChange={(e) => set('sort')(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="newest">Newest First</option>
            <option value="alpha">Alphabetical (A-Z)</option>
            <option value="popular">Most Popular</option>
          </select>
          <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--accent-gold)', fontWeight: 600 }}>
            Found {resultCount} matching results
          </div>
        </div>
      </div>
    </div>
  );
}
