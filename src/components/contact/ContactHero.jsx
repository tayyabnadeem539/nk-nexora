import useTypewriter from '../../hooks/useTypewriter.js';

const TITLE = 'Contact Us';

/** Video-backed contact heading with a looping typed title. */
export default function ContactHero() {
  const typed = useTypewriter(TITLE, {
    loop: true, typeSpeed: 105, deleteSpeed: 65, holdDelay: 2100, nextDelay: 520, respectReducedMotion: true
  });

  return (
    <div className="contact-hero">
      <video className="contact-bg-video" autoPlay muted loop playsInline aria-hidden="true">
        <source src="videos/QdBZY2fkU-0.mp4" type="video/mp4" />
      </video>
      <div className="contact-video-shade" aria-hidden="true" />
      <div className="container contact-container">
        <div className="contact-heading">
          <span className="contact-eyebrow">GET IN TOUCH</span>
          <h1 className="contact-title" aria-label={TITLE}>
            <span id="contactTypewriter" aria-hidden="true">{typed}</span>
            <span className="contact-cursor" aria-hidden="true" />
          </h1>
          <p className="contact-intro">Have questions, partnership inquiries, or editorial submissions? We'd love to hear from you.</p>
        </div>
      </div>
    </div>
  );
}
