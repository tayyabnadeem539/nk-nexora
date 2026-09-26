/* Stack of toast notifications fed by services/notificationService.js */
import { useCallback, useEffect, useState } from 'react';
import { subscribeToasts } from '../../services/notificationService.js';
import Toast from './Toast.jsx';

const MAX_VISIBLE = 4;

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => subscribeToasts(t => setToasts(list => [...list.slice(-(MAX_VISIBLE - 1)), t])), []);

  const dismiss = useCallback((id) => setToasts(list => list.filter(t => t.id !== id)), []);

  return (
    <div className="fv-toast-stack" aria-live="polite">
      {toasts.map(t => <Toast key={t.id} toast={t} onDismiss={dismiss} />)}
    </div>
  );
}
