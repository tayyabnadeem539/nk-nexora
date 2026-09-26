/* Demo merchandise cart — persisted in sessionStorage */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { STORAGE_KEYS, readJSON, writeJSON } from '../services/storageService.js';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

const readStored = () => readJSON(sessionStorage, STORAGE_KEYS.cart, []);

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStored);
  const [isOpen, setIsOpen] = useState(false);

  const save = useCallback((next) => {
    writeJSON(sessionStorage, STORAGE_KEYS.cart, next);
    setItems(next);
  }, []);

  const addToCart = useCallback((product) => {
    const next = readStored();
    const existing = next.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      next.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        franchise: product.franchise || '',
        category: product.category || '',
        qty: 1
      });
    }
    save(next);
    setIsOpen(true);
  }, [save]);

  const updateQty = useCallback((id, delta) => {
    let next = readStored();
    const item = next.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) next = next.filter(i => i.id !== id);
    save(next);
  }, [save]);

  const removeFromCart = useCallback((id) => save(readStored().filter(i => i.id !== id)), [save]);
  const clearCart = useCallback(() => save([]), [save]);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return {
      count: items.reduce((sum, item) => sum + item.qty, 0),
      subtotal: subtotal.toFixed(2),
      total: subtotal.toFixed(2) // demo: no taxes or fees
    };
  }, [items]);

  const value = useMemo(() => ({
    items, totals, isOpen, openCart, closeCart, addToCart, updateQty, removeFromCart, clearCart
  }), [items, totals, isOpen, openCart, closeCart, addToCart, updateQty, removeFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
