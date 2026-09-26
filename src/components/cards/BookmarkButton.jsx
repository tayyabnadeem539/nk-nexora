import { useBookmarks } from '../../context/BookmarksContext.jsx';
import { BookmarkIcon } from '../common/Icons.jsx';

/** Bookmark toggle shown on article, character and event cards. */
export default function BookmarkButton({ id, type, style, title }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(id);

  return (
    <button
      type="button"
      className={`btn-bookmark-card ${saved ? 'bookmarked' : ''}`}
      style={style}
      onClick={(e) => { e.stopPropagation(); toggleBookmark(id, type); }}
      title={title || (saved ? 'Remove Bookmark' : 'Add to Bookmarks')}
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}
