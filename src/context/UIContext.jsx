/* UI state — modals, gallery lightbox, mobile drawer, chatbot window, demo auth */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import FANDOM_DATA from '../data/fandomData.js';

const UIContext = createContext(null);

export const useUI = () => useContext(UIContext);

const exists = (collection, id) => FANDOM_DATA[collection]?.some(item => item.id === id);

export function UIProvider({ children }) {
  // modal: null | { type: 'article' | 'character' | 'video' | 'auth', id?, tab? }
  const [modal, setModal] = useState(null);
  const [lightbox, setLightbox] = useState({ open: false, items: [], index: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const openArticleModal = useCallback((id) => { if (exists('articles', id)) setModal({ type: 'article', id }); }, []);
  const openCharacterModal = useCallback((id) => { if (exists('characters', id)) setModal({ type: 'character', id }); }, []);
  const openVideoModal = useCallback((id) => { if (exists('trailers', id)) setModal({ type: 'video', id }); }, []);
  const openAuthModal = useCallback((tab = 'login') => setModal({ type: 'auth', tab }), []);

  const openLightbox = useCallback((categoryId, index) => {
    setLightbox({ open: true, items: FANDOM_DATA.galleries?.[categoryId] || [], index });
  }, []);
  const closeLightbox = useCallback(() => setLightbox(lb => ({ ...lb, open: false })), []);
  const stepLightbox = useCallback((delta) => {
    setLightbox(lb => (lb.items.length
      ? { ...lb, index: (lb.index + delta + lb.items.length) % lb.items.length }
      : lb));
  }, []);
  const lightboxPrev = useCallback(() => stepLightbox(-1), [stepLightbox]);
  const lightboxNext = useCallback(() => stepLightbox(1), [stepLightbox]);

  const closeAllModals = useCallback(() => {
    setModal(null);
    setLightbox(lb => ({ ...lb, open: false }));
  }, []);

  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleChat = useCallback(() => setChatOpen(o => !o), []);

  const value = useMemo(() => ({
    modal, setModal, closeAllModals,
    openArticleModal, openCharacterModal, openVideoModal, openAuthModal,
    lightbox, openLightbox, closeLightbox, lightboxPrev, lightboxNext,
    mobileMenuOpen, openMobileMenu, closeMobileMenu,
    chatOpen, toggleChat,
    loggedIn, setLoggedIn
  }), [
    modal, closeAllModals, openArticleModal, openCharacterModal, openVideoModal, openAuthModal,
    lightbox, openLightbox, closeLightbox, lightboxPrev, lightboxNext,
    mobileMenuOpen, openMobileMenu, closeMobileMenu, chatOpen, toggleChat, loggedIn
  ]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
