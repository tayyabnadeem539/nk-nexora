/* Root route layout: header, routed page (<Outlet />), mobile drawer, global overlays and footer. */
import { Outlet } from 'react-router-dom';
import CartDrawer from '../components/cart/CartDrawer.jsx';
import Chatbot from '../components/chatbot/Chatbot.jsx';
import Toaster from '../components/common/Toaster.jsx';
import Footer from '../components/layout/Footer.jsx';
import Header from '../components/layout/Header.jsx';
import MobileDrawer from '../components/layout/MobileDrawer.jsx';
import Preloader from '../components/layout/Preloader.jsx';
import AudioPlayerDock from '../components/media/AudioPlayerDock.jsx';
import ModalRoot from '../components/modals/ModalRoot.jsx';
import useGlobalShortcuts from '../hooks/useGlobalShortcuts.js';
import useNavigationEffects from '../hooks/useNavigationEffects.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function MainLayout() {
  useNavigationEffects();
  useGlobalShortcuts();
  useScrollReveal();

  return (
    <>
      <Preloader />
      <Header />

      <main id="viewContainer" className="main-content-area" role="main">
        <Outlet />
      </main>

      <MobileDrawer />
      <ModalRoot />
      <CartDrawer />
      <AudioPlayerDock />
      <Chatbot />
      <Footer />
      <Toaster />
    </>
  );
}
