import FANDOM_DATA from '../data/fandomData.js';
import { ArticleCard, CharacterCard, EventCard, MerchCard, ReleaseCard, TrailerCard } from '../components/cards/index.js';
import ContentSection from '../components/common/ContentSection.jsx';
import CategoryMarquee from '../components/home/CategoryMarquee.jsx';
import HeroSlider from '../components/home/HeroSlider.jsx';
import HubQuickLinks from '../components/home/HubQuickLinks.jsx';
import PortalTicker from '../components/home/PortalTicker.jsx';
import TrendingStrip from '../components/home/TrendingStrip.jsx';

const { categories = [], articles = [], characters = [], trailers = [], events = [], merchandise = [], releases = [] } = FANDOM_DATA;

// First article of each category for the trending strip
const TRENDING = categories.map(cat => articles.find(a => a.category === cat.id)).filter(Boolean);
// Second article of each category (+ one extra anime piece) for the featured grid
const FEATURED = [
  ...categories.map(cat => articles.filter(a => a.category === cat.id)[1]),
  articles.filter(a => a.category === 'anime')[2]
].filter(Boolean);
const UPCOMING_EVENTS = events.filter(e => e.status === 'upcoming').slice(0, 4);

const actionLink = (href, label) => <a href={href} className="section-action-link">{label} &rarr;</a>;

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CategoryMarquee categories={categories} />
      <PortalTicker />
      <HubQuickLinks categories={categories} />

      <ContentSection title="Trending Across Fandoms" subtitle="The hottest topics, breaking adaptations, and fan milestones this week">
        <TrendingStrip articles={TRENDING} />
      </ContentSection>

      <ContentSection tone="primary" title="Featured Long-Form & Editorial" subtitle="Deep dive retrospectives, creator spotlights, and production breakdowns">
        <div className="grid-4">{FEATURED.map(art => <ArticleCard key={art.id} art={art} />)}</div>
      </ContentSection>

      <ContentSection
        title="Iconic Characters & Dossiers"
        subtitle="Explore biographies, key traits, and series lore for fan-favorite protagonists"
        action={actionLink('#anime', 'All 35+ Character Profiles')}
      >
        <div className="grid-4">{characters.slice(0, 8).map(char => <CharacterCard key={char.id} char={char} />)}</div>
      </ContentSection>

      <ContentSection
        tone="primary"
        title="Latest Trailers & Media Hub"
        subtitle="High-definition teaser trailers, director interviews, and podcasts"
        action={actionLink('#trailers', 'Browse All Media')}
      >
        <div className="grid-3">{trailers.slice(0, 6).map(tr => <TrailerCard key={tr.id} tr={tr} />)}</div>
      </ContentSection>

      <ContentSection
        title="Upcoming Fandom Events"
        subtitle="Conventions, global festivals, and premier award celebrations"
        action={actionLink('#events', 'Full Events Calendar')}
      >
        <div className="grid-2">{UPCOMING_EVENTS.map(ev => <EventCard key={ev.id} ev={ev} />)}</div>
      </ContentSection>

      <ContentSection
        tone="primary"
        title="Official Fan Merchandise"
        subtitle="Explore officially licensed figures, collectibles, apparel, and vinyl editions"
        action={actionLink('#merch', 'View Full Store')}
      >
        <div className="grid-3">{merchandise.slice(0, 6).map(m => <MerchCard key={m.id} m={m} />)}</div>
      </ContentSection>

      <ContentSection title="Upcoming Release Radar" subtitle="Track dates for upcoming video games, movies, anime seasons, and albums">
        <div className="grid-2">{releases.slice(0, 6).map(rel => <ReleaseCard key={rel.id} r={rel} />)}</div>
      </ContentSection>
    </>
  );
}
