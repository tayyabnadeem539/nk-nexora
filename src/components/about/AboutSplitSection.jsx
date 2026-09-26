import { Fragment } from 'react';

/**
 * Two-column About section: overline + heading on the left, copy on the right.
 * `title` is an array of lines (rendered with <br>).
 */
export default function AboutSplitSection({ overline, title, dark = false, children }) {
  return (
    <section className={`content-section about-section ${dark ? 'about-section-dark' : ''}`.trim()}>
      <div className="container about-two-column">
        <div className="about-side-title">
          <span className="about-overline">{overline}</span>
          <h2>
            {title.map((line, i) => (
              <Fragment key={line}>{i > 0 && <br />}{line}</Fragment>
            ))}
          </h2>
        </div>
        <div className="about-copy">{children}</div>
      </div>
    </section>
  );
}
