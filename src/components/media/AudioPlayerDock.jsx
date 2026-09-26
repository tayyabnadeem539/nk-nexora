/* Floating bottom dock for podcast audio playback. */
import { FALLBACK_AUDIO_THUMB } from '../../constants/index.js';
import { useAudio } from '../../context/AudioContext.jsx';
import { formatTime } from '../../utils/format.js';
import { PauseIcon, PlayIcon } from '../common/Icons.jsx';

export default function AudioPlayerDock() {
  const { track, dockOpen, playing, time, togglePlay, closeDock } = useAudio();
  const { current, duration } = time;
  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div className={`audio-bar-dock ${dockOpen ? 'active' : ''}`}>
      <div className="audio-bar-content">
        <div className="audio-track-info">
          <img className="audio-thumb" src={track?.thumbnail || FALLBACK_AUDIO_THUMB} alt="Audio Thumbnail" />
          <div className="audio-titles">
            <span className="audio-title-text">{track?.title || 'Episode Audio'}</span>
            <span className="audio-cat-tag">{track ? `${track.category.toUpperCase()} Podcast Audio` : 'Podcast Audio'}</span>
          </div>
        </div>

        <div className="audio-controls">
          <button type="button" className="audio-play-pause-btn" onClick={togglePlay}>
            {playing ? <PauseIcon /> : <PlayIcon size={18} />}
          </button>
        </div>

        <div className="audio-scrub-bar-wrap">
          <div className="audio-progress-track">
            <div className="audio-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span>{duration ? `${formatTime(current)} / ${formatTime(duration)}` : '0:00 / 0:00'}</span>
        </div>

        <button type="button" onClick={closeDock} style={{ color: 'var(--text-muted)', fontSize: 18 }} title="Close Player">✕</button>
      </div>
    </div>
  );
}
