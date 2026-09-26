import { useAudio } from '../../context/AudioContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { highlight } from '../../utils/highlight.jsx';
import { MicIcon, PlayIcon } from '../common/Icons.jsx';
import { useTheatre } from '../theatre/TheatreContext.js';

/**
 * Trailer / interview card.
 * Podcasts play in the audio dock; videos play in the IMAX theater when the
 * card is on the Trailers page, otherwise in the video modal.
 */
export default function TrailerCard({ tr, term = '' }) {
  const { openVideoModal } = useUI();
  const { playTrack } = useAudio();
  const theatre = useTheatre();
  const isUpcoming = tr.releaseStatus === 'upcoming';
  const isPodcast = tr.mediaType === 'podcast';

  const handleClick = () => {
    if (isPodcast) playTrack(tr.id);
    else if (theatre) theatre.playAndFocus(tr.id);
    else openVideoModal(tr.id);
  };

  return (
    <div className="card-trailer" data-id={tr.id}>
      <div className="trailer-thumb-wrap" onClick={handleClick}>
        <img className="trailer-thumb-img" src={tr.thumbnail} alt={tr.title} loading="lazy" />
        <div className="play-overlay-icon">
          {isPodcast ? <MicIcon /> : <PlayIcon />}
        </div>
        <span className="trailer-duration">{tr.duration}</span>
        <span className={`trailer-status-tag ${isUpcoming ? 'status-upcoming' : 'status-released'}`}>
          {isUpcoming ? 'Upcoming' : 'Released'}
        </span>
        <div className="trailer-body">
          <div className="trailer-type-label">{tr.mediaType} • {tr.category}</div>
          <h3 className="trailer-title">{highlight(tr.title, term)}</h3>
          <div className="trailer-franchise">{tr.franchise}</div>
        </div>
      </div>
    </div>
  );
}
