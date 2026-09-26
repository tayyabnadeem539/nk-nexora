/* "Find your next trailer" search box with popular-title chips; results play in the theater. */
import { useRef, useState } from 'react';
import { POPULAR_CINEMA_TITLES, categoryLabel } from '../../constants/cinema.js';
import { plural } from '../../utils/format.js';

const MAX_RESULTS = 10;

function findTrailers(clips, query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return clips.filter(item =>
    [item.title, item.franchise, item.category].some(val => String(val || '').toLowerCase().includes(q))
  );
}

export default function TrailerSearch({ clips, onPlay }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const matches = findTrailers(clips, query);

  const pickChip = (title) => {
    setQuery(title);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && matches?.length) onPlay(matches[0].id);
  };

  return (
    <div className="fv-trailer-search">
      <label htmlFor="fvTrailerQuery">FIND YOUR NEXT TRAILER</label>
      <div className="fv-trailer-search-field">
        <span aria-hidden="true">⌕</span>
        <input
          ref={inputRef}
          id="fvTrailerQuery"
          type="search"
          placeholder="Search a movie, trailer, anime or game franchise..."
          autoComplete="off"
          aria-controls="fvTrailerResults"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>

      <div className="fv-trending-line">
        <span>POPULAR IN CINEMA</span>
        <div className="fv-trending-chips">
          {POPULAR_CINEMA_TITLES.map(title => (
            <button key={title} type="button" onClick={() => pickChip(title)}>{title}</button>
          ))}
        </div>
      </div>

      <div id="fvTrailerResults" className="fv-trailer-results" aria-live="polite">
        {matches && (
          <>
            <p className="fv-result-count">
              {matches.length
                ? `${plural(matches.length, 'trailer')} ready for cinema`
                : 'No trailer found for this query. Try another keyword.'}
            </p>
            {matches.slice(0, MAX_RESULTS).map(item => (
              <button key={item.id} type="button" className="fv-trailer-result" onClick={() => onPlay(item.id)}>
                <img src={item.thumbnail || ''} alt="" loading="lazy" />
                <span>
                  <strong>{item.title}</strong>
                  <small>{categoryLabel(item.category)} · {item.duration || 'VIDEO'}</small>
                </span>
                <b>PLAY IN CINEMA ▶</b>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
