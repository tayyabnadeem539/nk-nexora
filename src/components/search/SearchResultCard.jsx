import { ArticleCard, CharacterCard, EventCard, MerchCard, ReleaseCard, TrailerCard } from '../cards/index.js';

/** Renders a search index entry with the card that matches its content type. */
export default function SearchResultCard({ item, term }) {
  const raw = item.rawItem;
  switch (item.type) {
    case 'article': return <ArticleCard art={raw} term={term} />;
    case 'character': return <CharacterCard char={raw} term={term} />;
    case 'trailer': return <TrailerCard tr={raw} term={term} />;
    case 'event': return <EventCard ev={raw} term={term} />;
    case 'merchandise': return <MerchCard m={raw} term={term} />;
    case 'release': return <ReleaseCard r={raw} term={term} />;
    default: return null;
  }
}
