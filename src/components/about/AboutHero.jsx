import { ABOUT_ROTATING_WORDS, ABOUT_TITLE } from '../../constants/aboutContent.js';
import useTypewriter from '../../hooks/useTypewriter.js';

/** Video-backed heading with a looping typed title and rotating "Explore ..." line. */
export default function AboutHero() {
  const typed = useTypewriter(ABOUT_TITLE, {
    loop: true, typeSpeed: 70, deleteSpeed: 38, holdDelay: 2000, nextDelay: 450, respectReducedMotion: true
  });

  return (
    <section className="content-section about-heading">
      <video className="about-bg-video" autoPlay muted loop playsInline aria-hidden="true">
        <source src="/videos/bg.mp4" type="video/mp4" />
      </video>
      <div className="about-video-shade" aria-hidden="true" />

      <div className="container">
        <div className="about-heading-content">
          <span className="about-overline">ABOUT FANDOMVERSE</span>
          <h1 aria-label={ABOUT_TITLE}>
            <span id="aboutTypewriter" aria-hidden="true">{typed}</span>
            <span className="about-title-cursor" aria-hidden="true" />
          </h1>
          <p>
            FandomVerse is an entertainment discovery portal that brings stories, characters,
            updates and fan experiences together in one place.
          </p>

          <div className="about-rotating-line" aria-label="Explore stories, characters and fandoms">
            <span className="about-rotating-label">EXPLORE</span>
            <span className="about-rotating-words" aria-hidden="true">
              {ABOUT_ROTATING_WORDS.map(word => <span key={word}>{word}</span>)}
            </span>
          </div>

          <div className="about-heading-meta">
            <span>01 / THE IDEA</span>
            <span>02 / WHAT YOU'LL FIND</span>
            <span>03 / THE PROJECT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
