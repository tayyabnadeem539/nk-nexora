export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: 48, color: 'var(--accent-gold)', marginBottom: 12 }}>404</h1>
      <h2 style={{ fontSize: 24, color: '#fff', marginBottom: 16 }}>Fandom Galaxy Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>The portal dimension you are searching for does not exist.</p>
      <a href="#home" className="btn-hero-primary">Return to FandomVerse Central</a>
    </div>
  );
}
