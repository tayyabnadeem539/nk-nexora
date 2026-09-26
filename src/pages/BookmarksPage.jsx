import BookmarkCard from '../components/bookmarks/BookmarkCard.jsx';
import { BookmarkIcon, DownloadIcon } from '../components/common/Icons.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import { useBookmarks } from '../context/BookmarksContext.jsx';
import { exportBookmarks } from '../services/bookmarkExport.js';

function EmptyBookmarks() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
      <BookmarkIcon size={48} strokeWidth={1.5} style={{ margin: '0 auto 16px', color: 'var(--accent-gold)', opacity: 0.6 }} />
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>No bookmarks saved yet</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 20px' }}>Click the bookmark icon on any article, character, or event card to build your personalized fandom library.</p>
      <a href="#home" className="btn-hero-primary">Explore Content</a>
    </div>
  );
}

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <section className="content-section">
      <div className="container">
        <SectionHeader
          as="h1"
          style={{ alignItems: 'center' }}
          title="Your Saved Bookmarks"
          subtitle="Stored in your browser's Local Storage. Attach personal session notes or export your collection."
          action={
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn-hero-primary" onClick={exportBookmarks}>
                <DownloadIcon />
                Export Bookmarks (.md)
              </button>
            </div>
          }
        />

        {bookmarks.length === 0 ? <EmptyBookmarks /> : (
          <div className="grid-3">
            {bookmarks.map(b => <BookmarkCard key={b.id} item={b} />)}
          </div>
        )}
      </div>
    </section>
  );
}
