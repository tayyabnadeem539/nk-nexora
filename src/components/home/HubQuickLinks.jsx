/** Grid of image tiles linking to each category hub. */
export default function HubQuickLinks({ categories }) {
  return (
    <section className="content-section" style={{ padding: '28px 0', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div className="grid-6">
          {categories.map(cat => (
            <a key={cat.id} href={`#${cat.id}`} className="card-hub-quick">
              <img className="card-hub-bg" src={cat.banner} alt={cat.title} />
              <div className="card-hub-overlay">
                <div className="card-hub-tagline">{cat.stats.articles}+ Articles</div>
                <div className="card-hub-title">{cat.title}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
