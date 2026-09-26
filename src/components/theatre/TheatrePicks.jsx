import { categoryLabel } from '../../constants/cinema.js';

/** Quick-pick row of featured trailers under the theater. */
export default function TheatrePicks({ clips, selectedId, onPick }) {
  return (
    <div className="fv-theatre-picks">
      {clips.map(clip => (
        <button
          key={clip.id}
          type="button"
          className={`fv-theatre-pick ${clip.id === selectedId ? 'is-selected' : ''}`}
          onClick={() => onPick(clip.id)}
        >
          <img src={clip.thumbnail || ''} alt="" loading="lazy" />
          <span>
            <small>{categoryLabel(clip.category)}</small>
            <strong>{clip.title}</strong>
          </span>
          <b>▶</b>
        </button>
      ))}
    </div>
  );
}
