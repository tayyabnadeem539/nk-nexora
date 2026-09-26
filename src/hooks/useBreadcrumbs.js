import { useMatches, useSearchParams } from 'react-router-dom';

/**
 * Breadcrumb trail for the current route: [{ label, to? }, …], always starting at Home.
 * Built from each matched route's `handle.crumbs` (see routes/routes.jsx).
 */
export default function useBreadcrumbs() {
  const matches = useMatches();
  const [searchParams] = useSearchParams();

  const trail = [{ label: 'Home', to: '/' }];
  matches.forEach(match => {
    const crumbs = match.handle?.crumbs;
    if (crumbs) trail.push(...crumbs({ params: match.params, searchParams }));
  });
  return trail;
}
