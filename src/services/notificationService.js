/**
 * Themed toast notifications (replaces native alert()).
 * Callable from anywhere, including non-React modules:
 *   notify({ type: 'success' | 'info' | 'warning' | 'error', title, message, duration })
 */
const listeners = new Set();
let nextId = 1;

export function notify({ type = 'info', title, message = '', duration = 4200 }) {
  const toast = { id: nextId++, type, title, message, duration };
  listeners.forEach(fn => fn(toast));
  return toast.id;
}

export function subscribeToasts(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
