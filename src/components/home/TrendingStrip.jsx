import { useRef } from 'react';
import { ArticleCard } from '../cards/index.js';

const SCROLL_STEP = 360;

/** Horizontally scrolling article strip with arrow buttons. */
export default function TrendingStrip({ articles }) {
  const stripRef = useRef(null);
  const scroll = (distance) => stripRef.current?.scrollBy({ left: distance, behavior: 'smooth' });

  return (
    <div className="scroll-strip-wrap">
      <button className="scroll-arrow-btn scroll-arrow-prev" onClick={() => scroll(-SCROLL_STEP)} aria-label="Scroll left">&#10094;</button>
      <div className="scroll-strip" ref={stripRef}>
        {articles.map(art => <ArticleCard key={art.id} art={art} />)}
      </div>
      <button className="scroll-arrow-btn scroll-arrow-next" onClick={() => scroll(SCROLL_STEP)} aria-label="Scroll right">&#10095;</button>
    </div>
  );
}
