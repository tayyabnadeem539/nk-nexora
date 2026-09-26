/* Export saved bookmarks (with session notes) as a downloadable Markdown file. */
import { STORAGE_KEYS, getNote, readJSON } from './storageService.js';
import { notify } from './notificationService.js';

function buildMarkdown(list) {
  let output = `# FANDOMVERSE - SAVED BOOKMARKS EXPORT\n`;
  output += `Generated: ${new Date().toLocaleString()}\n`;
  output += `Total Items Saved: ${list.length}\n`;
  output += `==================================================\n\n`;

  list.forEach((item, index) => {
    output += `${index + 1}. [${item.type.toUpperCase()}] ${item.title}\n`;
    output += `   Category: ${item.category.toUpperCase()}\n`;
    if (item.series) output += `   Franchise/Series: ${item.series}\n`;
    output += `   Saved On: ${item.dateSaved}\n`;
    const note = getNote(item.id);
    if (note) output += `   Personal Note (Session): "${note}"\n`;
    output += `\n`;
  });

  output += `==================================================\n`;
  output += `FandomVerse Portal - Portal for Fandom World\n`;
  return output;
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportBookmarks() {
  const list = readJSON(localStorage, STORAGE_KEYS.bookmarks, []);
  if (list.length === 0) {
    notify({ type: 'warning', title: 'Nothing to Export', message: 'Bookmark some articles, characters, or events first, then export your collection.' });
    return;
  }

  downloadFile(buildMarkdown(list), `fandomverse-saved-bookmarks-${new Date().toISOString().slice(0, 10)}.md`);
  notify({ type: 'success', title: 'Bookmarks Exported', message: `${list.length} saved item${list.length === 1 ? '' : 's'} downloaded as a Markdown file.` });
}
