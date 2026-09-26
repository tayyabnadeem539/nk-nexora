/**
 * Browser storage helpers
 * - Bookmarks in localStorage
 * - Personal notes + demo cart in sessionStorage
 */
export const STORAGE_KEYS = {
  bookmarks: 'fandomverse_bookmarks',
  cart: 'fandomverse_demo_cart',
  notePrefix: 'fandomverse_note_'
};

export function readJSON(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function writeJSON(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
  }
}

// ---------- Session notes ----------

export function getNote(id) {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.notePrefix + id) || '';
  } catch (e) {
    return '';
  }
}

export function saveNote(id, text) {
  try {
    if (!text || text.trim() === '') sessionStorage.removeItem(STORAGE_KEYS.notePrefix + id);
    else sessionStorage.setItem(STORAGE_KEYS.notePrefix + id, text.trim());
    return true;
  } catch (e) {
    console.error('Error saving note to SessionStorage', e);
    return false;
  }
}

export function deleteNote(id) {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.notePrefix + id);
  } catch (e) {}
}
