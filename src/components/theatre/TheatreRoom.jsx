/* The 3D auditorium: walls, ceiling, floor, back wall, projector beam and the curtained screen. */
import { videoSrc } from '../../constants/index.js';

export default function TheatreRoom({ featured, roomRef, videoRef, videoHandlers, onPlayFeatured }) {
  return (
    <div className="fv-theatre-room" ref={roomRef}>
      {/* Side walls with speakers, sconces and exit sign */}
      <div className="fv-theatre-wall fv-theatre-wall-left">
        <div className="fv-wall-speaker" />
        <div className="fv-wall-sconce" />
      </div>
      <div className="fv-theatre-wall fv-theatre-wall-right">
        <div className="fv-wall-speaker" />
        <div className="fv-wall-sconce" />
        <div className="fv-wall-exit-sign">EXIT ➔</div>
      </div>

      <div className="fv-theatre-ceiling" />
      <div className="fv-theatre-floor" />

      {/* Back wall (seen when turning 180°) */}
      <div className="fv-theatre-back-wall">
        <div className="fv-theatre-back-wall-title">★ FANDOMVERSE GRAND IMAX THEATER ★</div>
        <div className="fv-projector-booth">
          <div className="fv-projector-lens" />
          <span>4K LASER PROJECTION BOOTH</span>
        </div>
        <div className="fv-back-doors">
          <div className="fv-back-door">AUDITORIUM ENTRANCE A</div>
          <div className="fv-back-door">AUDITORIUM ENTRANCE B</div>
        </div>
      </div>

      <div className="fv-projector-beam" />

      {/* Screen + velvet curtains */}
      <div className="fv-theatre-screen">
        <video ref={videoRef} controls playsInline preload="metadata" poster={featured.thumbnail || ''} {...videoHandlers}>
          <source src={videoSrc(featured.youtubeId)} type="video/mp4" />
        </video>

        <div className="fv-theatre-curtains">
          <div className="fv-curtain-valance">
            <span className="fv-curtain-valance-title">★ FANDOMVERSE GRAND CINEMA ★</span>
          </div>
          <div className="fv-curtain-left"><span className="fv-curtain-tassel fv-curtain-tassel-left" /></div>
          <div className="fv-curtain-right"><span className="fv-curtain-tassel fv-curtain-tassel-right" /></div>
        </div>

        <button className="fv-theatre-play" type="button" onClick={onPlayFeatured} aria-label="Play featured trailer">
          <span>▶</span>
          OPEN CURTAINS & PLAY TRAILER
        </button>
      </div>

      <div className="fv-theatre-audience" aria-hidden="true" />
    </div>
  );
}
