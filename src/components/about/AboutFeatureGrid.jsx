import { ABOUT_FEATURES } from '../../constants/aboutContent.js';
import { pad2 } from '../../utils/format.js';

/** "02 / What you'll find" — numbered feature cards. */
export default function AboutFeatureGrid() {
  return (
    <section className="content-section about-section about-section-dark">
      <div className="container">
        <div className="about-section-heading">
          <span className="about-overline">02 / WHAT YOU'LL FIND</span>
          <h2>More than a collection of pages.</h2>
          <p>Everything is arranged to make exploring your interests easier.</p>
        </div>

        <div className="about-feature-grid">
          {ABOUT_FEATURES.map((feature, i) => (
            <article key={feature.title} className="about-feature">
              <span className="about-feature-number">{pad2(i + 1)}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
