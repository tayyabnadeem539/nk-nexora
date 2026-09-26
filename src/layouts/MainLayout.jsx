/* Page shell: header, routed content, mobile drawer, global overlays and footer. */
import CartDrawer from '../components/cart/CartDrawer.jsx';
import Chatbot from '../components/chatbot/Chatbot.jsx';
import Toaster from '../components/common/Toaster.jsx';
import Footer from '../components/layout/Footer.jsx';
import Header from '../components/layout/Header.jsx';
import MobileDrawer from '../components/layout/MobileDrawer.jsx';
import Preloader from '../components/layout/Preloader.jsx';
import AudioPlayerDock from '../components/media/AudioPlayerDock.jsx';
import ModalRoot from '../components/modals/ModalRoot.jsx';

export default function MainLayout({ activePath, breadcrumbs, children }) {
  return (
    <>
      <Preloader />
      <Header activePath={activePath} />

      <main id="viewContainer" className="main-content-area" role="main">
        {children}
      </main>

      <MobileDrawer activePath={activePath} breadcrumbs={breadcrumbs} />
      <ModalRoot />
      <CartDrawer />
      <AudioPlayerDock />
      <Chatbot />
      <Footer />
      <Toaster />
    </>
  );
}
