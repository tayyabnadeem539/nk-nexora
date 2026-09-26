import { useUI } from '../../context/UIContext.jsx';
import { highlight } from '../../utils/highlight.jsx';
import BookmarkButton from './BookmarkButton.jsx';

export default function CharacterCard({ char, term = '' }) {
  const { openCharacterModal } = useUI();
  const name = highlight(char.name, term);

  return (
    <div className="card-character" data-id={char.id} onClick={() => openCharacterModal(char.id)}>
      <div className="char-thumb-wrap">
        <img className="char-thumb-img" src={char.image} alt={char.name} loading="lazy" />
        <span className="char-series-badge">{char.series}</span>
        <BookmarkButton id={char.id} type="character" />
        <div className="char-preview-badge">
          <span className="char-preview-name">{name}</span>
        </div>
        <div className="char-body">
          <h3 className="char-name">{name}</h3>
          <div className="char-role">{char.role}</div>
          <div className="char-traits-row">
            {(char.traits || []).slice(0, 3).map(t => <span key={t} className="trait-tag">{t}</span>)}
          </div>
          <button
            type="button"
            className="btn-view-char"
            onClick={(e) => { e.stopPropagation(); openCharacterModal(char.id); }}
          >
            View Dossier &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
