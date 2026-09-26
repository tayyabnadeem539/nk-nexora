import { useUI } from '../../context/UIContext.jsx';

/**
 * Shared modal frame. The backdrop stays mounted and toggles `.active`
 * so the stylesheet's fade/scale transitions run on open and close.
 */
export default function ModalShell({ id, active, containerStyle, containerClass = '', closeLabel = 'Close modal', children }) {
  const { closeAllModals } = useUI();

  return (
    <div id={id} className={`modal-backdrop ${active ? 'active' : ''}`}>
      <div className={`modal-container ${containerClass}`} style={containerStyle}>
        <button type="button" className="modal-close-btn" onClick={closeAllModals} aria-label={closeLabel}>✕</button>
        {children}
      </div>
    </div>
  );
}
