import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple cart store with a fake demo line for preview.
// Methods: addItem, removeItem, inc, dec, toggleExtra, clear

export const useCartStore = create(persist((set, get) => ({
  // initial state: one demo line so the UI shows something
  items: [],

  // selectors / getters
  getSubtotal: () => {
    const items = get().items || [];
    return items.reduce((acc, it) => {
      const lineTotal = it.unitPrice * (it.qty || 1) + ((it.extra && it.extra.checked) ? (it.extra.price || 0) : 0);
      return acc + lineTotal;
    }, 0);
  },

  // actions
  addItem: (product) => {
    set((state) => {
      const exists = state.items.find((i) => i.productId === product.productId);
      if (exists) {
        return { items: state.items.map(i => i.productId === product.productId ? { ...i, qty: (i.qty||1) + (product.qty||1) } : i) };
      }
      return { items: [...state.items, product] };
    });
  },

  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  inc: (id) => set((state) => ({ items: state.items.map(i => i.id === id ? { ...i, qty: (i.qty||1) + 1 } : i) })),

  dec: (id) => set((state) => ({ items: state.items.map(i => {
    if (i.id === id) {
      const newQty = (i.qty || 1) - 1;
      return { ...i, qty: Math.max(1, newQty) };
    }
    return i;
  }) })),

  toggleExtra: (id) => set((state) => ({ items: state.items.map(i => i.id === id ? { ...i, extra: { ...(i.extra||{}), checked: !((i.extra||{}).checked) } } : i) })),

  clear: () => set({ items: [] }),

} ), { name: 'wa_cart_v1' }));

export default useCartStore;