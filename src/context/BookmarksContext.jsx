/* Bookmarks — persisted in localStorage */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import FANDOM_DATA from '../data/fandomData.js';
import { STORAGE_KEYS, readJSON, writeJSON } from '../services/storageService.js';

const BookmarksContext = createContext(null);

export const useBookmarks = () => useContext(BookmarksContext);

const COLLECTIONS = { article: 'articles', character: 'characters', event: 'events' };

function findItem(type, id) {
  return FANDOM_DATA[COLLECTIONS[type]]?.find(item => item.id === id) || null;
}

const readStored = () => readJSON(localStorage, STORAGE_KEYS.bookmarks, []);

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(readStored);

  const save = useCallback((list) => {
    writeJSON(localStorage, STORAGE_KEYS.bookmarks, list);
    setBookmarks(list);
  }, []);

  const isBookmarked = useCallback((id) => bookmarks.some(b => b.id === id), [bookmarks]);

  const toggleBookmark = useCallback((id, type) => {
    const item = findItem(type, id);
    if (!item) return;
    const list = readStored();
    const index = list.findIndex(b => b.id === id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.unshift({
        id: item.id,
        type: type || 'article',
        title: item.title || item.name,
        category: item.category,
        image: item.image || item.thumbnail,
        series: item.series || item.franchise || '',
        dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    }
    save(list);
  }, [save]);

  const removeBookmark = useCallback((id) => save(readStored().filter(b => b.id !== id)), [save]);

  const value = useMemo(
    () => ({ bookmarks, isBookmarked, toggleBookmark, removeBookmark }),
    [bookmarks, isBookmarked, toggleBookmark, removeBookmark]
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}
