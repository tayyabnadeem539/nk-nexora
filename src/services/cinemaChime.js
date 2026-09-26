/* Warm harmonic chime played when the theater curtains open (Web Audio, no files). */
const NOTES_HZ = [523.25, 659.25, 783.99, 1046.5];

export function playCinemaChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    NOTES_HZ.forEach((freq, idx) => {
      const start = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.06, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1.3);
    });

    setTimeout(() => ctx.close().catch(() => {}), 1600);
  } catch (e) {
    // Audio is decorative — ignore failures
  }
}
