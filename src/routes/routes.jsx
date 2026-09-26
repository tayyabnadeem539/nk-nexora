/**
 * Application routes (React Router data router).
 *
 * Every route may declare `handle.crumbs({ params, searchParams })` returning the
 * breadcrumb items after "Home" — read by hooks/useBreadcrumbs.js.
 */
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { CATEGORY_HUB_NAMES } from '../constants/index.js';
import MainLayout from '../layouts/MainLayout.jsx';
import {
  AboutPage, BookmarksPage, CategoryPage, ContactPage, DeepLinkPage, EventsPage,
  HomePage, MerchandisePage, NotFoundPage, SearchPage, TrailersPage
} from '../pages/index.js';
import { PATHS } from './paths.js';

const CATEGORY_IDS = ['anime', 'gaming', 'movies', 'tv-shows', 'k-pop', 'comics', 'manga'];

/** Handle for a route with a single breadcrumb. */
const crumb = (label, to) => ({ crumbs: () => [{ label, to }] });

export const routes = [
  {
    path: PATHS.home,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },

      ...CATEGORY_IDS.map(id => ({
        path: id,
        element: <CategoryPage key={id} categoryId={id} />,
        handle: crumb(CATEGORY_HUB_NAMES[id], PATHS.category(id))
      })),
      { path: 'kpop', element: <Navigate to={PATHS.category('k-pop')} replace /> },

      {
        path: 'search',
        element: <SearchPage />,
        handle: {
          crumbs: ({ searchParams }) => {
            const q = searchParams.get('q');
            return [{ label: q ? `Search: "${q}"` : 'Global Search', to: PATHS.search() }];
          }
        }
      },
      { path: 'trailers', element: <TrailersPage />, handle: crumb('Trailers & Media', PATHS.trailers) },
      { path: 'events', element: <EventsPage />, handle: crumb('Events Calendar', PATHS.events) },
      { path: 'merch', element: <MerchandisePage />, handle: crumb('Official Merchandise', PATHS.merch) },
      { path: 'bookmarks', element: <BookmarksPage />, handle: crumb('Saved Bookmarks', PATHS.bookmarks) },
      { path: 'about', element: <AboutPage />, handle: crumb('About Us', PATHS.about) },
      { path: 'contact', element: <ContactPage />, handle: crumb('Contact Us', PATHS.contact) },

      // Shareable links that open an article / character over the home page
      {
        path: 'article/:id',
        element: <DeepLinkPage type="article" />,
        handle: { crumbs: ({ params }) => [{ label: 'Articles' }, { label: params.id }] }
      },
      {
        path: 'character/:id',
        element: <DeepLinkPage type="character" />,
        handle: { crumbs: ({ params }) => [{ label: 'Characters' }, { label: params.id }] }
      },

      { path: '*', element: <NotFoundPage />, handle: crumb('404 Not Found') }
    ]
  }
];

export const router = createBrowserRouter(routes);
