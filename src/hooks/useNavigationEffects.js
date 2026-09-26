import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext.jsx';
import { pathFromLegacyHash } from '../routes/paths.js';

/**
 * Side-effects of every navigation:
 * - redirect old hash links (/#anime → /anime)
 * - close modals + mobile drawer
 * - scroll back to the top
 */
export default function useNavigationEffects() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const { closeAllModals, closeMobileMenu } = useUI();

  useEffect(() => {
    if (pathname === '/' && /^#\/?[a-z]/i.test(hash)) {
      navigate(pathFromLegacyHash(hash), { replace: true });
    }
  }, [pathname, hash, navigate]);

  useEffect(() => {
    closeAllModals();
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search, closeAllModals, closeMobileMenu]);
}
