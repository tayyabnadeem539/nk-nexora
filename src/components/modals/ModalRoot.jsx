/* Mounts every modal once; each one decides from UIContext whether it is open. */
import Lightbox from '../gallery/Lightbox.jsx';
import ArticleModal from './ArticleModal.jsx';
import AuthModal from './AuthModal.jsx';
import CharacterModal from './CharacterModal.jsx';
import VideoModal from './VideoModal.jsx';

export default function ModalRoot() {
  return (
    <>
      <ArticleModal />
      <CharacterModal />
      <VideoModal />
      <Lightbox />
      <AuthModal />
    </>
  );
}
