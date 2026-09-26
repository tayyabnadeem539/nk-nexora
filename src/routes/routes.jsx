/**
 * Hash route table.
 * resolveRoute('anime') → { element, breadcrumbs, deepLink? }
 */
import { CATEGORY_HUB_NAMES } from '../constants/index.js';
import {
  AboutPage, BookmarksPage, CategoryPage, ContactPage, EventsPage, HomePage,
  MerchandisePage, NotFoundPage, SearchPage, TrailersPage
} from '../pages/index.js';

const STATIC_ROUTES = {
  home: { Page: HomePage, crumb: null },
  trailers: { Page: TrailersPage, crumb: 'Trailers & Media' },
  events: { Page: EventsPage, crumb: 'Events Calendar' },
  merch: { Page: MerchandisePage, crumb: 'Official Merchandise' },
  bookmarks: { Page: BookmarksPage, crumb: 'Saved Bookmarks' },
  about: { Page: AboutPage, crumb: 'About Us' },
  contact: { Page: ContactPage, crumb: 'Contact Us' }
};

/** #article/<id> and #character/<id> render Home and open the matching modal. */
const DEEP_LINKS = { article: 'Articles', character: 'Characters' };

export function resolveRoute(path, query) {
  const [section, id] = path.split('/');
  if (id && DEEP_LINKS[section]) {
    return {
      element: <HomePage />,
      breadcrumbs: ['Home', DEEP_LINKS[section], id],
      deepLink: { type: section, id }
    };
  }

  if (CATEGORY_HUB_NAMES[path]) {
    const categoryId = path === 'kpop' ? 'k-pop' : path;
    return {
      element: <CategoryPage key={categoryId} categoryId={categoryId} />,
      breadcrumbs: ['Home', CATEGORY_HUB_NAMES[path]]
    };
  }

  if (path === 'search') {
    return {
      element: <SearchPage initialTerm={query} />,
      breadcrumbs: ['Home', query ? `Search: "${query}"` : 'Global Search']
    };
  }

  const route = STATIC_ROUTES[path];
  if (route) {
    const { Page, crumb } = route;
    return { element: <Page />, breadcrumbs: crumb ? ['Home', crumb] : ['Home'] };
  }

  return { element: <NotFoundPage />, breadcrumbs: ['Home', '404 Not Found'] };
}
