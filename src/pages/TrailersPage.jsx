import { useMemo, useState } from 'react';
import FANDOM_DATA from '../data/fandomData.js';
import { TrailerCard } from '../components/cards/index.js';
import ContentSection from '../components/common/ContentSection.jsx';
import FilterPills from '../components/common/FilterPills.jsx';
import CinemaTheatre from '../components/theatre/CinemaTheatre.jsx';
import { TheatreContext } from '../components/theatre/TheatreContext.js';
import TheatrePicks from '../components/theatre/TheatrePicks.jsx';
import TrailerSearch from '../components/theatre/TrailerSearch.jsx';
import { LOCAL_VIDEO_IDS } from '../constants/cinema.js';
import { FILTER_CATEGORIES } from '../constants/index.js';
import useCinemaTheatre from '../hooks/useCinemaTheatre.js';

const ALL_TRAILERS = FANDOM_DATA.trailers || [];
const PICKS_COUNT = 6;

/** Video clips for the theater, trailers with a local mp4 first. */
function getClips(list) {
  const hasLocal = (t) => (LOCAL_VIDEO_IDS.includes(t.youtubeId) ? 1 : 0);
  return list
    .filter(t => t.mediaType !== 'podcast' && t.youtubeId)
    .sort((a, b) => hasLocal(b) - hasLocal(a));
}

/** Theater + picks + card grid for one category filter (re-mounted when the filter changes). */
function TrailersHub({ category, onCategoryChange }) {
  const list = useMemo(() => ALL_TRAILERS.filter(t => category === 'all' || t.category === category), [category]);
  const clips = useMemo(() => getClips(list), [list]);
  const featured = clips[0] || ALL_TRAILERS[0];
  const theatre = useCinemaTheatre(featured);

  return (
    <TheatreContext.Provider value={theatre.actions}>
      <TrailerSearch clips={clips} onPlay={theatre.actions.playAndFocus} />

      {featured && (
        <>
          <CinemaTheatre featured={featured} theatre={theatre} />
          <TheatrePicks clips={clips.slice(0, PICKS_COUNT)} selectedId={theatre.state.selectedId} onPick={theatre.actions.play} />
        </>
      )}

      <FilterPills options={FILTER_CATEGORIES} value={category} onChange={onCategoryChange} className="fv-theatre-filters" style={null} />
      <div className="grid-3">{list.map(t => <TrailerCard key={t.id} tr={t} />)}</div>
    </TheatreContext.Provider>
  );
}

export default function TrailersPage() {
  const [category, setCategory] = useState('all');

  return (
    <ContentSection
      headingLevel="h1"
      title="Trailers, Interviews & Audio Hub"
      subtitle="Aggregated multimedia showcases, official announcement trailers, and IMAX 3D Cinema"
    >
      <TrailersHub key={category} category={category} onCategoryChange={setCategory} />
    </ContentSection>
  );
}
