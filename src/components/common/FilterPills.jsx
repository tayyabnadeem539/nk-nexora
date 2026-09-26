/**
 * Row of filter pill buttons.
 * `options` is either a list of values (label = value uppercased) or [value, label] pairs.
 */
export default function FilterPills({ options, value, onChange, className = '', style = { marginBottom: 24 } }) {
  return (
    <div className={`filter-pills-list ${className}`.trim()} style={style}>
      {options.map(opt => {
        const [key, label] = Array.isArray(opt) ? opt : [opt, opt.toUpperCase()];
        return (
          <button key={key} type="button" className={`filter-pill ${key === value ? 'active' : ''}`} onClick={() => onChange(key)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
