import { useUI } from '../../context/UIContext.jsx';
import { highlight } from '../../utils/highlight.jsx';
import BookmarkButton from './BookmarkButton.jsx';

export default function ArticleCard({ art, term = '' }) {
  const { openArticleModal } = useUI();

  return (
    <article className="card-article" data-id={art.id} onClick={() => openArticleModal(art.id)}>
      <div className="article-thumb-wrap">
        <img className="article-thumb-img" src={art.image} alt={art.title} loading="lazy" />
        <span className="card-category-badge">{art.category}</span>
        <BookmarkButton id={art.id} type="article" />
        <div className="article-body">
          <div className="article-meta-top">
            <span>{art.date}</span>
            <span>•</span>
            <span>{art.readTime}</span>
          </div>
          <h3 className="article-card-title">{highlight(art.title, term)}</h3>
          <p className="article-card-desc">{art.summary || (art.content ? art.content.substring(0, 110) + '...' : '')}</p>
          <div className="article-card-footer">
            <span>By {art.author}</span>
            <span className="btn-read-link">Read Article &rarr;</span>
          </div>
        </div>
      </div>
    </article>
  );
}
