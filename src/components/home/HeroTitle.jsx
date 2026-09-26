import useTypewriter from '../../hooks/useTypewriter.js';

/** Hero headline typed out character-by-character while its slide is active. */
export default function HeroTitle({ text, active }) {
  const typed = useTypewriter(text, { enabled: active, typeSpeed: 28 });

  return (
    <h1 className="hero-title">
      <span className="hero-title-typed">{typed}</span>
      <span className="hero-title-cursor">|</span>
    </h1>
  );
}
