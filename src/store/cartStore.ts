import { create } from "zustand";
interface CartItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}
interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    })),
  clearCart: () => set({ items: [] }),
  totalPrice: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}));
