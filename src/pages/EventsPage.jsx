import { useState } from 'react';
import FANDOM_DATA from '../data/fandomData.js';
import { EventCard } from '../components/cards/index.js';
import ContentSection from '../components/common/ContentSection.jsx';
import FilterPills from '../components/common/FilterPills.jsx';

const ALL_EVENTS = FANDOM_DATA.events || [];
const STATUS_OPTIONS = [
  ['all', `All Events (${ALL_EVENTS.length})`],
  ['upcoming', 'Upcoming Only'],
  ['past', 'Past Highlights']
];

export default function EventsPage() {
  const [status, setStatus] = useState('all');
  const list = ALL_EVENTS.filter(e => status === 'all' || e.status === status);

  return (
    <ContentSection
      headingLevel="h1"
      title="Global Fandom Events Calendar"
      subtitle="Track major pop-culture conventions, anime expos, gaming tournaments, and award ceremonies"
    >
      <FilterPills options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      <div className="grid-2">{list.map(e => <EventCard key={e.id} ev={e} />)}</div>
    </ContentSection>
  );
}
