import { useEffect, useState } from 'react';

/** Parses window.location.hash into { path, query } — e.g. "#search?q=luffy". */
function parseHash() {
  let raw = window.location.hash.slice(1).trim();
  if (!raw) raw = 'home';
  const [path, queryString] = raw.split('?');
  const query = queryString ? new URLSearchParams(queryString).get('q') || '' : '';
  return { path, query, key: raw };
}

export default function useHashRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
