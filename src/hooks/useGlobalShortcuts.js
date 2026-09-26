import { useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useUI } from '../context/UIContext.jsx';

/**
 * App-wide keyboard + scroll behaviour:
 * - Escape closes modals, lightbox, cart drawer and mobile menu
 * - Left/Right arrows navigate the gallery lightbox
 * - Page scroll is locked while a modal, lightbox or the cart is open
 */
export default function useGlobalShortcuts() {
  const { modal, lightbox, closeAllModals, closeMobileMenu, lightboxPrev, lightboxNext } = useUI();
  const { isOpen: cartOpen, closeCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = (modal || lightbox.open || cartOpen) ? 'hidden' : '';
  }, [modal, lightbox.open, cartOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
        closeCart();
        closeMobileMenu();
      } else if (e.key === 'ArrowLeft' && lightbox.open) {
        lightboxPrev();
      } else if (e.key === 'ArrowRight' && lightbox.open) {
        lightboxNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox.open, closeAllModals, closeCart, closeMobileMenu, lightboxPrev, lightboxNext]);
}
