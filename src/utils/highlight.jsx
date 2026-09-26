const MARK_STYLE = { background: 'rgba(245, 197, 24, 0.35)', color: '#fff', padding: '1px 3px', borderRadius: '2px' };

/** Returns text with every case-insensitive match of `query` wrapped in <mark>. */
export function highlight(text, query) {
  if (!query || !query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.split(regex).map((part, i) =>
    i % 2 === 1 ? <mark key={i} style={MARK_STYLE}>{part}</mark> : part
  );
}
