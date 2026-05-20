import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  discount: number;
  taxRate: number;
  customerId?: string;
  customerName?: string;
  paymentMethod: string;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDiscount: (discount: number) => void;
  setTaxRate: (rate: number) => void;
  setCustomer: (id?: string, name?: string) => void;
  setPaymentMethod: (method: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  getEstimatedProfit: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discount: 0,
  taxRate: 0,
  paymentMethod: 'cash',

  addItem: (product, quantity = 1) => {
    const { items } = get();
    const existing = items.find((i) => i.product._id === product._id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        ),
      });
    } else {
      set({ items: [...items, { product, quantity: Math.min(quantity, product.stock) }] });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.product._id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.product._id === productId
          ? { ...i, quantity: Math.min(quantity, i.product.stock) }
          : i
      ),
    });
  },

  setDiscount: (discount) => set({ discount }),
  setTaxRate: (taxRate) => set({ taxRate }),
  setCustomer: (customerId, customerName) => set({ customerId, customerName }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  clearCart: () =>
    set({
      items: [],
      discount: 0,
      taxRate: 0,
      customerId: undefined,
      customerName: undefined,
      paymentMethod: 'cash',
    }),

  getSubtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  getTaxAmount: () => {
    const { discount, taxRate } = get();
    const subtotal = get().getSubtotal();
    return ((subtotal - discount) * taxRate) / 100;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    return subtotal - get().discount + get().getTaxAmount();
  },

  getEstimatedProfit: () => {
    const { items, discount, taxRate } = get();
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const cost = items.reduce((sum, i) => sum + i.product.costPrice * i.quantity, 0);
    const tax = ((subtotal - discount) * taxRate) / 100;
    return subtotal - discount + tax - cost;
  },
}));
