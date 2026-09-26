import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUI } from '../context/UIContext.jsx';
import HomePage from './HomePage.jsx';

const OPEN_DELAY_MS = 150; // after the navigation effect has closed any open modal

/** /article/:id and /character/:id — renders Home and opens the matching modal. */
export default function DeepLinkPage({ type }) {
  const { id } = useParams();
  const { openArticleModal, openCharacterModal } = useUI();

  useEffect(() => {
    const t = setTimeout(() => {
      if (type === 'article') openArticleModal(id);
      else openCharacterModal(id);
    }, OPEN_DELAY_MS);
    return () => clearTimeout(t);
  }, [type, id, openArticleModal, openCharacterModal]);

  return <HomePage />;
}
