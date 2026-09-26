import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths.js';

/** Continuously looping strip of category names (list doubled for a seamless loop). */
export default function CategoryMarquee({ categories }) {
  return (
    <div className="category-marquee-bar">
      <div className="marquee-track">
        {[...categories, ...categories].map((cat, i) => (
          <Fragment key={`${cat.id}-${i}`}>
            <Link to={PATHS.category(cat.id)} className="marquee-item">
              <span className="marquee-dot" style={{ background: cat.color, color: cat.color }} />
              {cat.title}
            </Link>
            <span className="marquee-sep" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
