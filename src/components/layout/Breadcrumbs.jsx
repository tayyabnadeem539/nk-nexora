import { Fragment } from 'react';
import { CRUMB_LINKS } from '../../constants/navigation.js';
import { HomeIcon } from '../common/Icons.jsx';

function crumbHref(crumb) {
  const c = crumb.toLowerCase();
  if (c === 'home') return '#home';
  return CRUMB_LINKS.find(([key]) => c.includes(key))?.[1] || '#home';
}

/** Breadcrumb trail items (rendered inside a <ul>). */
export default function Breadcrumbs({ trail, onNavigate }) {
  if (trail.length <= 1) {
    return (
      <>
        <li className="breadcrumb-item"><a href="#home" onClick={onNavigate}><HomeIcon /> Home</a></li>
        <span className="breadcrumb-separator">/</span>
        <li className="breadcrumb-item active">Portal Central</li>
      </>
    );
  }

  return trail.map((crumb, idx) => (
    idx === trail.length - 1 ? (
      <li key={idx} className="breadcrumb-item active">{crumb}</li>
    ) : (
      <Fragment key={idx}>
        <li className="breadcrumb-item"><a href={crumbHref(crumb)} onClick={onNavigate}>{crumb}</a></li>
        <span className="breadcrumb-separator">/</span>
      </Fragment>
    )
  ));
}
