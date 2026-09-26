import { highlight } from '../../utils/highlight.jsx';
import { splitEventDate } from '../../utils/format.js';
import { PinIcon } from '../common/Icons.jsx';
import BookmarkButton from './BookmarkButton.jsx';

export default function EventCard({ ev, term = '' }) {
  const { month, day } = splitEventDate(ev.date);
  const isUpcoming = ev.status === 'upcoming';

  return (
    <div className="card-event" data-id={ev.id}>
      <div className="event-date-side">
        <span className="event-month">{month}</span>
        <span className="event-day">{day}</span>
        <span className={`event-status-badge ${isUpcoming ? 'event-status-upcoming' : 'event-status-past'}`}>
          {isUpcoming ? 'Upcoming' : 'Past Event'}
        </span>
      </div>
      <div className="event-main-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="event-category-tag">{ev.category} • {ev.type}</div>
          <BookmarkButton id={ev.id} type="event" style={{ position: 'static' }} title="Bookmark Event" />
        </div>
        <h3 className="event-title">{highlight(ev.title, term)}</h3>
        <div className="event-venue-info">
          <PinIcon />
          <span>{ev.location}</span>
        </div>
        <p className="event-desc">{ev.description}</p>
        <div className="event-tags-row">
          {(ev.tags || []).map(t => <span key={t} className="trait-tag">{t}</span>)}
        </div>
      </div>
    </div>
  );
}
