import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '../common/Icons.jsx';

/**
 * Breadcrumb trail items (rendered inside a <ul>).
 * `trail` comes from hooks/useBreadcrumbs: [{ label, to? }, …] starting with Home.
 */
export default function Breadcrumbs({ trail, onNavigate }) {
  if (trail.length <= 1) {
    return (
      <>
        <li className="breadcrumb-item"><Link to="/" onClick={onNavigate}><HomeIcon /> Home</Link></li>
        <span className="breadcrumb-separator">/</span>
        <li className="breadcrumb-item active">Portal Central</li>
      </>
    );
  }

  return trail.map((crumb, idx) => (
    idx === trail.length - 1 ? (
      <li key={idx} className="breadcrumb-item active">{crumb.label}</li>
    ) : (
      <Fragment key={idx}>
        <li className="breadcrumb-item">
          {crumb.to ? <Link to={crumb.to} onClick={onNavigate}>{crumb.label}</Link> : <span>{crumb.label}</span>}
        </li>
        <span className="breadcrumb-separator">/</span>
      </Fragment>
    )
  ));
}
