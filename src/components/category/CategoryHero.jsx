/** Category hub header: title, tagline, subgenres and content stats. */
export default function CategoryHero({ category, stats }) {
  return (
    <header className="category-hero-header" style={{ '--category-color-alpha': `${category.color}22` }}>
      <div className="container">
        <div className="cat-hero-flex">
          <div className="cat-hero-main">
            <span className="cat-badge-chip">{category.title} Fandom Hub</span>
            <h1 className="cat-hero-title">{category.title}: {category.tagline}</h1>
            <p className="cat-hero-desc">{category.description}</p>
            <div className="cat-subgenre-pills">
              {category.subgenres.map(sg => <span key={sg} className="subgenre-pill">{sg}</span>)}
            </div>
          </div>

          <div className="cat-stats-card">
            {stats.map(([value, label]) => (
              <div key={label} className="cat-stat-box">
                <span className="cat-stat-num">{value}</span>
                <span className="cat-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
