/** Section title + subtitle row with an optional action on the right. */
export default function SectionHeader({ title, subtitle, as: Tag = 'h2', action, style }) {
  return (
    <div className="section-header-row" style={style}>
      <div className="section-title-wrap">
        <Tag className="section-title">{title}</Tag>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
