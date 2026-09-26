/* FandomVerse Grand IMAX Theater — HUD, 3D scene and "now showing" bar. */
import TheatreRoom from './TheatreRoom.jsx';
import TheatreToolbar from './TheatreToolbar.jsx';

export default function CinemaTheatre({ featured, theatre }) {
  const { refs, state, actions, sceneHandlers, videoHandlers } = theatre;

  const className = [
    'fv-theatre',
    state.playing && 'is-playing',
    state.curtainsOpen && 'curtains-open',
    state.lightsDim && 'is-lights-dim',
    state.cinemaMode && 'is-cinema-mode'
  ].filter(Boolean).join(' ');

  return (
    <div className={className} ref={refs.theatreRef}>
      <TheatreToolbar state={state} actions={actions} />

      <div className="fv-theatre-scene" {...sceneHandlers}>
        <TheatreRoom
          featured={featured}
          roomRef={refs.roomRef}
          videoRef={refs.videoRef}
          videoHandlers={videoHandlers}
          onPlayFeatured={() => actions.play(featured.id)}
        />
      </div>

      <div className="fv-theatre-details">
        <div>
          <span className="fv-theatre-kicker">NOW SHOWING IN CINEMA</span>
          <h2>{state.title}</h2>
        </div>
        <span className="fv-theatre-hint">{state.hint}</span>
      </div>
    </div>
  );
}
