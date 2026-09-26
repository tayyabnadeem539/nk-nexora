/* Podcast audio player — one shared <audio> element driving the floating dock */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import FANDOM_DATA from '../data/fandomData.js';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  if (!audioRef.current && typeof Audio !== 'undefined') audioRef.current = new Audio();

  const [track, setTrack] = useState(null);
  const [dockOpen, setDockOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ current: 0, duration: 0 });

  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setTime({ current: audio.currentTime, duration: audio.duration || 0 });
    const onEnded = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);

  const playTrack = useCallback((id) => {
    const tr = FANDOM_DATA.trailers?.find(t => t.id === id);
    if (!tr || !tr.audioUrl) return;
    const audio = audioRef.current;
    audio.src = tr.audioUrl;
    audio.play().catch(e => console.log('Audio autoplay prevented', e));
    setTrack(tr);
    setDockOpen(true);
    setPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play().catch(() => {});
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, []);

  const closeDock = useCallback(() => {
    audioRef.current.pause();
    setPlaying(false);
    setDockOpen(false);
  }, []);

  const value = useMemo(
    () => ({ track, dockOpen, playing, time, playTrack, togglePlay, closeDock }),
    [track, dockOpen, playing, time, playTrack, togglePlay, closeDock]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
