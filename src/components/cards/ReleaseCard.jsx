import { highlight } from '../../utils/highlight.jsx';

export default function ReleaseCard({ r, term = '' }) {
  return (
    <div className="card-release" data-id={r.id}>
      <div className="release-date-pill">
        <span className="rel-days-badge">{r.daysRemaining ? `${r.daysRemaining} Days` : 'Soon'}</span>
        <div className="rel-date-text">{r.releaseDate}</div>
      </div>
      <div className="release-info-col">
        <span className="release-type-badge">{r.format} • {r.category}</span>
        <h4 className="release-title">{highlight(r.title, term)}</h4>
        <div className="release-platform">{r.platform}</div>
      </div>
    </div>
  );
}
