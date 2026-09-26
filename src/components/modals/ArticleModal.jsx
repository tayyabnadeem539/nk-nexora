import { Fragment, useRef } from 'react';
import FANDOM_DATA from '../../data/fandomData.js';
import { useUI } from '../../context/UIContext.jsx';
import ModalShell from './ModalShell.jsx';

function RelatedStories({ art }) {
  const { openArticleModal } = useUI();
  const related = FANDOM_DATA.articles.filter(a => a.category === art.category && a.id !== art.id).slice(0, 3);

  return (
    <div className="article-related-box">
      <h4>Related Stories from {art.category.toUpperCase()}</h4>
      <div className="grid-3">
        {related.map(ra => (
          <div key={ra.id} className="card-base" style={{ cursor: 'pointer' }} onClick={() => openArticleModal(ra.id)}>
            <img src={ra.image} alt={ra.title} style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
            <div style={{ padding: 10 }}>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{ra.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArticleModal() {
  const { modal } = useUI();
  const active = modal?.type === 'article';

  // Keep the last article rendered while the modal fades out
  const lastRef = useRef(null);
  if (active) lastRef.current = FANDOM_DATA.articles.find(a => a.id === modal.id) || lastRef.current;
  const art = lastRef.current;

  return (
    <ModalShell id="articleReaderModal" active={active}>
      {art && (
        <div key={art.id}>
          <div className="article-modal-hero">
            <img src={art.image} alt={art.title} />
            <div className="article-modal-hero-gradient" />
          </div>
          <div className="article-modal-content">
            <div className="article-modal-category">{art.category} • Feature Article</div>
            <h1 className="article-modal-title">{art.title}</h1>
            <div className="article-modal-byline">
              <span>By <strong>{art.author}</strong></span>
              <span>Published on {art.date}</span>
              <span>{art.readTime}</span>
            </div>
            <div className="article-modal-body">
              {art.content.split('\n\n').map((p, idx) => (
                <Fragment key={idx}>
                  <p>{p}</p>
                  {idx === 1 && (
                    <div className="article-pullquote">"{art.subtitle || 'A watershed moment in contemporary fandom history.'}"</div>
                  )}
                </Fragment>
              ))}
            </div>
            <RelatedStories art={art} />
          </div>
        </div>
      )}
    </ModalShell>
  );
}
