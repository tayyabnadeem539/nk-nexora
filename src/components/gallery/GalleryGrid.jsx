import { useUI } from '../../context/UIContext.jsx';
import { ExpandIcon } from '../common/Icons.jsx';

/** Category image gallery — clicking a still opens it in the Lightbox. */
export default function GalleryGrid({ categoryId, items }) {
  const { openLightbox } = useUI();

  return (
    <div className="grid-3">
      {items.map((img, idx) => (
        <div key={img.id || idx} className="card-base" style={{ cursor: 'pointer' }} onClick={() => openLightbox(categoryId, idx)}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', backgroundColor: '#000' }}>
            <img src={img.image} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-slow)' }} />
            <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: 11, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ExpandIcon />
              Enlarge
            </div>
          </div>
          <div style={{ padding: '12px 14px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{img.title}</h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{img.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
