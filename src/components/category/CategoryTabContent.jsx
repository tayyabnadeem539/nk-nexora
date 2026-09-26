/* Content area of a category hub, switched by the active filter tab. */
import { ArticleCard, CharacterCard, EventCard, MerchCard, ReleaseCard, TrailerCard } from '../cards/index.js';
import SectionHeader from '../common/SectionHeader.jsx';
import GalleryGrid from '../gallery/GalleryGrid.jsx';

const ArticleGrid = ({ items }) => <div className="grid-4">{items.map(a => <ArticleCard key={a.id} art={a} />)}</div>;
const CharacterGrid = ({ items }) => <div className="grid-4">{items.map(c => <CharacterCard key={c.id} char={c} />)}</div>;
const TrailerGrid = ({ items }) => <div className="grid-3">{items.map(t => <TrailerCard key={t.id} tr={t} />)}</div>;
const EventGrid = ({ items }) => <div className="grid-2">{items.map(e => <EventCard key={e.id} ev={e} />)}</div>;
const MerchGrid = ({ items }) => <div className="grid-3">{items.map(m => <MerchCard key={m.id} m={m} />)}</div>;
const ReleaseGrid = ({ items }) => <div className="grid-2">{items.map(r => <ReleaseCard key={r.id} r={r} />)}</div>;

function Block({ title, subtitle, last, children }) {
  return (
    <div style={last ? undefined : { marginBottom: 40 }}>
      <SectionHeader title={title} subtitle={subtitle} />
      {children}
    </div>
  );
}

/** "All Content" tab — every content type for the hub in stacked sections. */
function OverviewTab({ categoryId, content }) {
  const upper = categoryId.toUpperCase();
  const { articles, characters, gallery, trailers, events, merch, releases } = content;

  return (
    <>
      <Block title="Latest Articles & Reviews" subtitle={`In-depth stories, analysis, and news for ${upper}`}>
        <ArticleGrid items={articles.slice(0, 4)} />
      </Block>
      <Block title="Key Character Profiles" subtitle="Detailed dossiers, biographies, and iconic traits">
        <CharacterGrid items={characters} />
      </Block>
      <Block title={`${upper} Visual Gallery`} subtitle="Click any image to view in high-resolution interactive Lightbox">
        <GalleryGrid categoryId={categoryId} items={gallery} />
      </Block>
      <Block title="Featured Media, Video & Audio" subtitle="Trailers, creator interviews, and podcast episodes">
        <TrailerGrid items={trailers} />
      </Block>
      <Block title="Conventions & Highlights" subtitle="Past and upcoming community gatherings">
        <EventGrid items={events} />
      </Block>
      {merch.length > 0 && (
        <Block title="Featured Collectibles & Merch" subtitle="Officially licensed fan gear">
          <MerchGrid items={merch} />
        </Block>
      )}
      {releases.length > 0 && (
        <Block title="Upcoming Releases" subtitle="Dates for upcoming premier works" last>
          <ReleaseGrid items={releases} />
        </Block>
      )}
    </>
  );
}

export default function CategoryTabContent({ categoryId, tab, content }) {
  switch (tab) {
    case 'articles': return <ArticleGrid items={content.articles} />;
    case 'characters': return <CharacterGrid items={content.characters} />;
    case 'media': return <TrailerGrid items={content.trailers} />;
    case 'gallery': return <GalleryGrid categoryId={categoryId} items={content.gallery} />;
    case 'events': return <EventGrid items={content.events} />;
    case 'merch': return <MerchGrid items={content.merch} />;
    default: return <OverviewTab categoryId={categoryId} content={content} />;
  }
}

export { ArticleGrid };
