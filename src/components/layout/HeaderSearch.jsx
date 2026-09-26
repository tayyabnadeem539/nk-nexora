/* Header search box with Ctrl+K shortcut and instant-match dropdown. */
import { useEffect, useRef, useState } from 'react';
import { useUI } from '../../context/UIContext.jsx';
import { searchQuery } from '../../services/searchService.js';
import { SearchIcon } from '../common/Icons.jsx';

const dropdownStyle = {
  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
  background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-lg)', zIndex: 500, overflow: 'hidden'
};
const itemStyle = {
  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer',
  borderBottom: '1px solid var(--border-subtle)', transition: 'background var(--transition-fast)'
};

export default function HeaderSearch() {
  const { openArticleModal, openCharacterModal, openVideoModal } = useUI();
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Ctrl+K / Cmd+K focuses the search box
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close the dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && e.target !== inputRef.current) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const trimmed = term.trim();
  const results = trimmed ? searchQuery(trimmed).slice(0, 5) : [];

  const goToSearchPage = () => {
    setOpen(false);
    window.location.hash = trimmed ? `#search?q=${encodeURIComponent(trimmed)}` : '#search';
  };

  const openResult = (r) => {
    setOpen(false);
    if (r.type === 'article') openArticleModal(r.id);
    else if (r.type === 'character') openCharacterModal(r.id);
    else if (r.type === 'trailer') openVideoModal(r.id);
    else window.location.hash = `#search?q=${encodeURIComponent(r.id)}`;
  };

  return (
    <div className="header-search-wrap">
      <div className="header-search-box">
        <span className="search-icon-btn"><SearchIcon /></span>
        <input
          ref={inputRef}
          type="text"
          id="headerSearchInput"
          className="header-search-input"
          placeholder="Search across all 7 fandoms..."
          autoComplete="off"
          value={term}
          onChange={(e) => { setTerm(e.target.value); setOpen(!!e.target.value.trim()); }}
          onKeyUp={(e) => { if (e.key === 'Enter') goToSearchPage(); }}
        />
        <span className="search-shortcut-hint">Ctrl+K</span>
      </div>

      {open && trimmed && (
        <div ref={dropdownRef} id="headerSearchDropdown" style={dropdownStyle}>
          {results.length === 0 ? (
            <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
              No instant matches found. Press Enter for full search.
            </div>
          ) : (
            <>
              <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)' }}>
                Instant Matches ({results.length})
              </div>
              {results.map(r => (
                <div key={`${r.type}-${r.id}`} className="search-drop-item" onClick={() => openResult(r)} style={itemStyle}>
                  <img src={r.image} alt={r.title} style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--accent-gold)' }}>{r.category} • {r.typeLabel}</div>
                  </div>
                </div>
              ))}
              <div onClick={goToSearchPage} style={{ padding: '10px 14px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--accent-gold)', cursor: 'pointer', background: 'var(--bg-card)' }}>
                View all results for "{trimmed}" &rarr;
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
