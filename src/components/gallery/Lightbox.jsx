import { useUI } from '../../context/UIContext.jsx';

/** Fullscreen image viewer (arrow keys handled in hooks/useGlobalShortcuts). */
export default function Lightbox() {
  const { lightbox, closeLightbox, lightboxPrev, lightboxNext } = useUI();
  const item = lightbox.items[lightbox.index];

  return (
    <div id="lightboxModal" className={`lightbox-modal ${lightbox.open ? 'active' : ''}`}>
      <button type="button" className="modal-close-btn" onClick={closeLightbox} style={{ top: 20, right: 20, position: 'absolute' }} aria-label="Close Lightbox">✕</button>
      <button type="button" className="lightbox-nav-btn lightbox-btn-prev" onClick={lightboxPrev} aria-label="Previous image">&#10094;</button>

      <div className="lightbox-content-box">
        {item && <img className="lightbox-img" src={item.image} alt="Enlarged view" />}
      </div>

      <div className="lightbox-caption-bar">
        <div className="lightbox-caption-title">{item?.title}</div>
        <div className="lightbox-caption-text">{item?.caption}</div>
        <div style={{ fontSize: 11, color: 'var(--accent-gold)', marginTop: 6, fontWeight: 700 }}>
          {item ? `${lightbox.index + 1} of ${lightbox.items.length}` : ''}
        </div>
      </div>

      <button type="button" className="lightbox-nav-btn lightbox-btn-next" onClick={lightboxNext} aria-label="Next image">&#10095;</button>
    </div>
  );
}
