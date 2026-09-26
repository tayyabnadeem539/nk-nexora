import { useRef } from 'react';
import FANDOM_DATA from '../../data/fandomData.js';
import { useBookmarks } from '../../context/BookmarksContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import ModalShell from './ModalShell.jsx';

export default function CharacterModal() {
  const { modal } = useUI();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const active = modal?.type === 'character';

  const lastRef = useRef(null);
  if (active) lastRef.current = FANDOM_DATA.characters.find(c => c.id === modal.id) || lastRef.current;
  const char = lastRef.current;

  return (
    <ModalShell id="characterProfileModal" active={active} containerStyle={{ maxWidth: 820, overflow: 'hidden' }}>
      {char && (
        <div className="char-modal-layout">
          <div className="char-modal-portrait-side">
            <img src={char.image} alt={char.name} />
          </div>
          <div className="char-modal-details-side">
            <div className="char-modal-series">{char.series} • {char.category}</div>
            <h2 className="char-modal-name">{char.name}</h2>
            <div className="char-modal-role">{char.role}</div>

            {char.quote && <div className="char-quote-box">"{char.quote}"</div>}

            <div className="char-modal-bio-title">Biography & Character Lore</div>
            <p className="char-modal-bio">{char.biography}</p>

            <div className="char-modal-traits-title">Key Abilities & Personality Traits</div>
            <div className="char-modal-traits-list">
              {(char.traits || []).map(t => <span key={t} className="trait-pill-large">{t}</span>)}
            </div>

            <div className="char-modal-footer">
              <span style={{ fontSize: 13, color: 'var(--accent-gold)', fontWeight: 600 }}>Popularity Rating: {char.popularity || 95}%</span>
              <button type="button" className="btn-hero-primary" onClick={() => toggleBookmark(char.id, 'character')}>
                {isBookmarked(char.id) ? '★ Bookmarked' : '☆ Add to Bookmarks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
