import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CURTAIN_PLAY_DELAY_MS, DEFAULT_THEATRE_HINT, FALLBACK_VIDEO_SRCS, categoryLabel
} from '../constants/cinema.js';
import { videoSrc } from '../constants/index.js';
import FANDOM_DATA from '../data/fandomData.js';
import { playCinemaChime } from '../services/cinemaChime.js';
import useTheatreCamera from './useTheatreCamera.js';

/**
 * State + actions for the Grand IMAX Theater.
 * The <video> element is driven imperatively (src swaps, fallbacks) through videoRef.
 */
export default function useCinemaTheatre(featured) {
  const theatreRef = useRef(null);
  const roomRef = useRef(null);
  const videoRef = useRef(null);
  const timers = useRef([]);

  const [selectedId, setSelectedId] = useState(featured?.id || null);
  const [title, setTitle] = useState(featured?.title || '');
  const [hint, setHint] = useState(DEFAULT_THEATRE_HINT);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [lightsDim, setLightsDim] = useState(false);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [playing, setPlaying] = useState(false);
  const curtainsRef = useRef(false);

  const { sceneHandlers, recenter } = useTheatreCamera(roomRef);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    videoRef.current?.pause();
  }, []);

  const openCurtains = useCallback((onOpened) => {
    curtainsRef.current = true;
    setCurtainsOpen(true);
    setLightsDim(true);
    playCinemaChime();
    if (onOpened) timers.current.push(setTimeout(onOpened, CURTAIN_PLAY_DELAY_MS));
  }, []);

  const closeCurtains = useCallback(() => {
    curtainsRef.current = false;
    setCurtainsOpen(false);
    setLightsDim(false);
  }, []);

  const toggleCurtains = useCallback(() => {
    if (curtainsRef.current) closeCurtains();
    else openCurtains();
  }, [openCurtains, closeCurtains]);

  const stop = useCallback(() => {
    videoRef.current?.pause();
    setPlaying(false);
    closeCurtains();
  }, [closeCurtains]);

  const play = useCallback((id) => {
    const clip = FANDOM_DATA.trailers?.find(t => t.id === id);
    const video = videoRef.current;
    if (!clip || !video) return;

    recenter();
    setTitle(clip.title);
    setHint(`${categoryLabel(clip.category)} · ${clip.duration || '4K CINEMA'}`);
    setSelectedId(id);

    const launch = () => {
      video.pause();
      video.poster = clip.thumbnail || '';
      video.src = videoSrc(clip.youtubeId);
      video.load();
      setPlaying(true);
      video.play().catch(() => {
        // Trailer file missing — fall back to one that ships with the site
        const fallback = FALLBACK_VIDEO_SRCS.find(src => !src.includes(clip.youtubeId)) || FALLBACK_VIDEO_SRCS[0];
        video.src = fallback;
        video.play().catch(() => {});
      });
    };

    if (!curtainsRef.current) openCurtains(launch);
    else launch();
  }, [recenter, openCurtains]);

  /** Play and bring the theater into view (used by search results and trailer cards). */
  const playAndFocus = useCallback((id) => {
    play(id);
    theatreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [play]);

  // Video events: stop at the end, one-time fallback when the initial source fails
  const onVideoEnded = stop;
  const onVideoError = (e) => {
    const video = e.currentTarget;
    const current = video.currentSrc || video.src;
    const next = FALLBACK_VIDEO_SRCS.find(src => !current.includes(src));
    if (next && !video.dataset.fbApplied) {
      video.dataset.fbApplied = 'true';
      video.src = next;
      video.play().catch(() => {});
    }
  };

  return {
    refs: { theatreRef, roomRef, videoRef },
    state: { selectedId, title, hint, curtainsOpen, lightsDim, cinemaMode, playing },
    actions: {
      play,
      playAndFocus,
      stop,
      recenter,
      toggleCurtains,
      toggleLights: () => setLightsDim(d => !d),
      toggleCinemaMode: () => setCinemaMode(m => !m)
    },
    sceneHandlers,
    videoHandlers: { onEnded: onVideoEnded, onError: onVideoError }
  };
}
