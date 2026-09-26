import SectionHeader from './SectionHeader.jsx';

/**
 * Standard page section: full-width band + container + section header.
 * `tone="primary"` gives the alternating darker background.
 */
export default function ContentSection({ title, subtitle, action, tone, headingLevel, children }) {
  return (
    <section className="content-section" style={tone === 'primary' ? { backgroundColor: 'var(--bg-primary)' } : undefined}>
      <div className="container">
        {title && <SectionHeader title={title} subtitle={subtitle} action={action} as={headingLevel} />}
        {children}
      </div>
    </section>
  );
}
