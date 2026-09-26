/* Theater HUD: brand label, status pill and camera / curtain / light / IMAX controls. */

const ICONS = {
  center: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></>,
  curtains: <><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4" /><path d="M4 9h16" /><path d="M9 4v16" /><path d="M15 4v16" /></>,
  lights: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2v1" /><path d="M12 7a5 5 0 0 1 5 5c0 2-1 3.5-2 4.5V17H9v-.5C8 15.5 7 14 7 12a5 5 0 0 1 5-5z" /></>,
  imax: <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
};

function ToolButton({ icon, label, title, active, onClick }) {
  return (
    <button type="button" className={`fv-theatre-btn ${active ? 'active' : ''}`} onClick={onClick} title={title}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{ICONS[icon]}</svg>
      <span>{label}</span>
    </button>
  );
}

export default function TheatreToolbar({ state, actions }) {
  return (
    <div className="fv-theatre-top">
      <div className="fv-theatre-brand-row">
        <span className="fv-theatre-label"><i /> FANDOMVERSE GRAND IMAX THEATER</span>
        <span className="fv-theatre-status-pill">DOLBY ATMOS 4K</span>
      </div>

      <div className="fv-theatre-toolbar">
        <ToolButton icon="center" label="Center View" title="Reset Camera to Center Screen" onClick={actions.recenter} />
        <ToolButton
          icon="curtains"
          label={`Curtains: ${state.curtainsOpen ? 'Open' : 'Closed'}`}
          title="Open / Close Red Velvet Curtains"
          onClick={actions.toggleCurtains}
        />
        <ToolButton
          icon="lights"
          label={`Lights: ${state.lightsDim ? 'Dim' : 'Hall'}`}
          title="Dim / Brighten Hall Lights"
          onClick={actions.toggleLights}
        />
        <ToolButton icon="imax" label="IMAX Mode" title="Toggle Widescreen IMAX Mode" active={state.cinemaMode} onClick={actions.toggleCinemaMode} />
        <button className="fv-theatre-exit" type="button" onClick={actions.stop}>← Close Showtime</button>
      </div>
    </div>
  );
}
