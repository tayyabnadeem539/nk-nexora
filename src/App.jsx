import { useEffect } from 'react';
import { useUI } from './context/UIContext.jsx';
import useGlobalShortcuts from './hooks/useGlobalShortcuts.js';
import useHashRoute from './hooks/useHashRoute.js';
import useScrollReveal from './hooks/useScrollReveal.js';
import MainLayout from './layouts/MainLayout.jsx';
import { resolveRoute } from './routes/routes.jsx';

const DEEP_LINK_DELAY_MS = 150;

export default function App() {
  const { path, query, key } = useHashRoute();
  const { closeAllModals, closeMobileMenu, openArticleModal, openCharacterModal } = useUI();
  const { element, breadcrumbs, deepLink } = resolveRoute(path, query);

  useGlobalShortcuts();
  useScrollReveal();

  // On every navigation: close overlays, scroll to top, open deep-linked modals
  useEffect(() => {
    closeAllModals();
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!deepLink) return;
    const t = setTimeout(() => {
      if (deepLink.type === 'article') openArticleModal(deepLink.id);
      else openCharacterModal(deepLink.id);
    }, DEEP_LINK_DELAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <MainLayout activePath={path} breadcrumbs={breadcrumbs}>
      {element}
    </MainLayout>
  );
}
