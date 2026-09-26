import FANDOM_DATA from '../../data/fandomData.js';
import { videoSrc } from '../../constants/index.js';
import { useUI } from '../../context/UIContext.jsx';
import ModalShell from './ModalShell.jsx';

/** Trailer player — plays the local file; unmounting the <video> stops playback on close. */
export default function VideoModal() {
  const { modal } = useUI();
  const video = modal?.type === 'video' ? FANDOM_DATA.trailers.find(t => t.id === modal.id) : null;

  return (
    <ModalShell id="videoPlayerModal" active={!!video} containerClass="video-modal-wrap" closeLabel="Close video player">
      <div className="video-player-frame">
        {video && (
          <video key={video.id} controls autoPlay playsInline poster={video.thumbnail || ''}>
            <source src={videoSrc(video.youtubeId)} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="video-details-bar">
        {video && (
          <>
            <div className="video-modal-title">{video.title}</div>
            <p className="video-modal-desc">{video.description}</p>
          </>
        )}
      </div>
    </ModalShell>
  );
}
