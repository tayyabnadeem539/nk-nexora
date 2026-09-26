/* Saved bookmark with a session-only personal note editor. */
import { useState } from 'react';
import { useBookmarks } from '../../context/BookmarksContext.jsx';
import { notify } from '../../services/notificationService.js';
import { deleteNote, getNote, saveNote } from '../../services/storageService.js';
import { CloseXIcon } from '../common/Icons.jsx';

export default function BookmarkCard({ item }) {
  const { removeBookmark } = useBookmarks();
  const [savedNote, setSavedNote] = useState(() => getNote(item.id));
  const [draft, setDraft] = useState(savedNote);

  const handleSave = () => {
    saveNote(item.id, draft);
    setSavedNote(getNote(item.id));
    notify({
      type: 'success',
      title: 'Note Saved',
      message: draft.trim() ? 'Your personal note is stored for this browser session.' : 'Empty note removed from this session.'
    });
  };

  const handleClear = () => {
    deleteNote(item.id);
    setSavedNote('');
    setDraft('');
  };

  return (
    <div className="card-base" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }} data-id={item.id}>
      <div style={{ display: 'flex', gap: 12 }}>
        <img src={item.image} alt={item.title} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>{item.category} • {item.type}</div>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: '4px 0' }}>{item.title}</h4>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Saved: {item.dateSaved}</div>
        </div>
        <button type="button" onClick={() => removeBookmark(item.id)} style={{ color: 'var(--text-muted)', alignSelf: 'flex-start' }} title="Remove Bookmark">
          <CloseXIcon />
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: 10, marginTop: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
          <span>Personal Note (Session Only):</span>
          {savedNote && <button type="button" onClick={handleClear} style={{ color: 'var(--accent-red)', fontSize: 10 }}>Clear</button>}
        </div>
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', fontSize: 12, color: '#fff', resize: 'none' }}
          placeholder="Add thoughts, episode notes, reminders..."
        />
        <button type="button" className="btn-read-link" onClick={handleSave} style={{ marginTop: 6, fontSize: 11 }}>
          Save Note to Session
        </button>
      </div>
    </div>
  );
}
