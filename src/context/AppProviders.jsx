/* Composes every app-wide state provider in one place. */
import { AudioProvider } from './AudioContext.jsx';
import { BookmarksProvider } from './BookmarksContext.jsx';
import { CartProvider } from './CartContext.jsx';
import { UIProvider } from './UIContext.jsx';

export default function AppProviders({ children }) {
  return (
    <UIProvider>
      <BookmarksProvider>
        <CartProvider>
          <AudioProvider>{children}</AudioProvider>
        </CartProvider>
      </BookmarksProvider>
    </UIProvider>
  );
}
