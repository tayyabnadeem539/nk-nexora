/** 125 → "2:05" */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/** 1 → "01" */
export const pad2 = (n) => String(n).padStart(2, '0');

/** "Oct 12, 2026" → { month: "Oct", day: "12" } */
export function splitEventDate(date) {
  const parts = date.split(' ');
  return { month: parts[0] || 'TBA', day: parts[1]?.replace(',', '') || '2026' };
}

export const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
