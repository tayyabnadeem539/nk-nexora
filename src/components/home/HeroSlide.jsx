import { forwardRef } from 'react';
import { videoSrc } from '../../constants/index.js';
import { useUI } from '../../context/UIContext.jsx';
import { ChevronRight, ExpandIcon } from '../common/Icons.jsx';
import HeroTitle from './HeroTitle.jsx';

/**
 * One hero slide: backdrop, copy + CTAs, and the trailer side player.
 * Transition classes (active / leaving / pre-enter / dir-*) are applied
 * imperatively by HeroSlider through the forwarded ref.
 */
const HeroSlide = forwardRef(function HeroSlide({ slide, index, active, videoKey, videoRef, onPlay }, ref) {
  const { openArticleModal } = useUI();

  const readFeature = slide.articleId
    ? (e) => { e.preventDefault(); openArticleModal(slide.articleId); }
    : undefined;

  return (
    <div ref={ref} className={`hero-slide ${index === 0 ? 'active' : ''}`} data-index={index}>
      <img className="hero-backdrop-img" src={slide.image} alt={slide.title} />
      <div className="hero-gradient-overlay" />
      <div className="container hero-content-container">
        <div className="hero-split-layout">
          <div className="hero-content-col">
            <div className="hero-badge-row">
              <span className="hero-tag">{slide.tag}</span>
              <span className="hero-meta-pill">{slide.type}</span>
            </div>
            <HeroTitle text={slide.title} active={active} />
            <p className="hero-description">{slide.desc}</p>
            <div className="hero-cta-group">
              <button type="button" className="btn-hero-primary" onClick={() => onPlay(false)} aria-label="Watch Full Trailer">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
                Watch Trailer
              </button>
              <a href={slide.route} className="btn-hero-secondary" onClick={readFeature}>
                Read Full Feature
                <ChevronRight size={15} />
              </a>
              <a href={slide.route} className="btn-hero-ghost">Explore Hub</a>
            </div>
          </div>

          <div className="hero-trailer-sider">
            <div className="trailer-sider-card">
              <div className="trailer-sider-header">
                <div className="trailer-sider-badge">
                  <span className="trailer-live-pulse" />
                  <span>OFFICIAL TRAILER</span>
                </div>
                <span className="trailer-sider-duration">{slide.duration}</span>
              </div>
              <div className="trailer-sider-screen">
                <video key={videoKey} ref={videoRef} className="hero-trailer-iframe" poster={slide.image} controls preload="none" playsInline>
                  <source src={videoSrc(slide.youtubeId)} type="video/mp4" />
                </video>
              </div>
              <div className="trailer-sider-footer">
                <div className="trailer-sider-title-wrap">
                  <div className="trailer-sider-title">{slide.trailerTitle}</div>
                </div>
                <button type="button" className="trailer-cinema-btn" onClick={() => onPlay(true)} title="Watch in Full Cinema Mode with Sound">
                  <ExpandIcon size={15} />
                  <span>Cinema Mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HeroSlide;
