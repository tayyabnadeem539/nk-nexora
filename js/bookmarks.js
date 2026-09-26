/**
 * FandomVerse - Bookmarks & Personal Notes System
 * SRS Compliance:
 * - Bookmarks stored in browser's Local Storage.
 * - Personal notes stored in Session Storage (current session only).
 * - Export bookmarks as a formatted list (.txt / .md).
 */

const Bookmarks = {
  STORAGE_KEY: 'fandomverse_bookmarks',
  NOTES_PREFIX: 'fandomverse_note_',

  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading bookmarks from LocalStorage', e);
      return [];
    }
  },

  isBookmarked(id) {
    const list = this.getAll();
    return list.some(item => item.id === id);
  },

  toggle(item) {
    let list = this.getAll();
    const index = list.findIndex(b => b.id === item.id);
    let added = false;

    if (index > -1) {
      list.splice(index, 1);
      added = false;
    } else {
      list.unshift({
        id: item.id,
        type: item.type || 'article',
        title: item.title || item.name,
        category: item.category,
        image: item.image || item.thumbnail,
        series: item.series || item.franchise || '',
        dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      added = true;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      this.updateBadges();
      // Dispatch custom event for reactive UI updates
      window.dispatchEvent(new CustomEvent('bookmarksUpdated', { detail: { list, added, item } }));
    } catch (e) {
      console.error('Error saving bookmarks to LocalStorage', e);
    }

    return added;
  },

  remove(id) {
    let list = this.getAll();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    this.updateBadges();
    window.dispatchEvent(new CustomEvent('bookmarksUpdated', { detail: { list } }));
  },

  // Session Storage Notes
  getNote(id) {
    try {
      return sessionStorage.getItem(this.NOTES_PREFIX + id) || '';
    } catch (e) {
      return '';
    }
  },

  saveNote(id, text) {
    try {
      if (!text || text.trim() === '') {
        sessionStorage.removeItem(this.NOTES_PREFIX + id);
      } else {
        sessionStorage.setItem(this.NOTES_PREFIX + id, text.trim());
      }
      return true;
    } catch (e) {
      console.error('Error saving note to SessionStorage', e);
      return false;
    }
  },

  deleteNote(id) {
    try {
      sessionStorage.removeItem(this.NOTES_PREFIX + id);
    } catch (e) {}
  },

  // Export Bookmarks as a Formatted Text/Markdown List
  exportFormattedList() {
    const list = this.getAll();
    if (list.length === 0) {
      alert('You have no bookmarked items to export! Bookmark some articles, characters, or events first.');
      return;
    }

    let output = `# FANDOMVERSE - SAVED BOOKMARKS EXPORT\n`;
    output += `Generated: ${new Date().toLocaleString()}\n`;
    output += `Total Items Saved: ${list.length}\n`;
    output += `==================================================\n\n`;

    list.forEach((item, index) => {
      output += `${index + 1}. [${item.type.toUpperCase()}] ${item.title}\n`;
      output += `   Category: ${item.category.toUpperCase()}\n`;
      if (item.series) output += `   Franchise/Series: ${item.series}\n`;
      output += `   Saved On: ${item.dateSaved}\n`;

      const note = this.getNote(item.id);
      if (note) {
        output += `   Personal Note (Session): "${note}"\n`;
      }
      output += `\n`;
    });

    output += `==================================================\n`;
    output += `FandomVerse Portal - Portal for Fandom World\n`;

    // Trigger file download
    const blob = new Blob([output], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fandomverse-saved-bookmarks-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  updateBadges() {
    const count = this.getAll().length;
    document.querySelectorAll('.bookmark-badge-counter').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

window.Bookmarks = Bookmarks;
