import AboutFeatureGrid from '../components/about/AboutFeatureGrid.jsx';
import AboutHero from '../components/about/AboutHero.jsx';
import AboutSplitSection from '../components/about/AboutSplitSection.jsx';
import { ABOUT_CATEGORIES, ABOUT_PROJECT_DETAILS } from '../constants/aboutContent.js';

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutHero />

      <AboutSplitSection overline="01 / THE IDEA" title={['What is', 'FandomVerse?']}>
        <p>
          Fans often visit different websites to read about a series, discover characters, watch
          trailers and keep track of events. FandomVerse brings those interests into one organized space.
        </p>
        <p>
          Whether you're following an anime, looking into a new game, reading about a movie or
          discovering your next favorite artist, you can explore it here through dedicated fandom categories.
        </p>
        <div className="about-quote">
          <span>✦</span>
          <strong>One universe. Millions of stories.</strong>
        </div>
      </AboutSplitSection>

      <AboutFeatureGrid />

      <AboutSplitSection overline="THE FANDOMS" title={['Seven worlds.', 'One place.']}>
        <p>
          FandomVerse covers seven entertainment categories. Each one has its own space, so you can
          go straight to the stories that interest you.
        </p>
        <div className="about-category-list">
          {ABOUT_CATEGORIES.map(([path, label]) => (
            <a key={path} href={`#${path}`}>{label} <span>↗</span></a>
          ))}
        </div>
      </AboutSplitSection>

      <AboutSplitSection overline="03 / THE PROJECT" title={['Behind the', 'portal.']} dark>
        <p>
          FandomVerse was developed as a web project for <strong>TechWiz 7 — The World Tech Championship</strong> under
          the <strong>Fandom Universe</strong> theme and <strong>Web Innovation Unleashed</strong> category.
        </p>
        <p>
          The website is a responsive single-page application built with React and Vite. It uses local
          content data, hash-based navigation and browser storage for features such as bookmarks.
        </p>
        <div className="about-project-details">
          {ABOUT_PROJECT_DETAILS.map(([label, value]) => (
            <div key={label}><span>{label}</span><strong>{value}</strong></div>
          ))}
        </div>
        <p className="about-disclaimer">
          FandomVerse is an academic demonstration project. Franchise names, characters and related
          media belong to their respective owners.
        </p>
      </AboutSplitSection>
    </div>
  );
}
