"use client";
import { useCartStore } from "@/store/cartStore";
export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCartStore();
  if (items.length === 0) return <div className="p-4">Cart is empty</div>;
  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-white shadow p-4 overflow-y-auto z-50">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-2">
            <img src={item.thumbnail} alt={item.title} className="w-12 h-12 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p>${item.price}</p>
              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                className="border rounded w-16 p-1 mt-1"
              />
            </div>
            <button onClick={() => removeFromCart(item.productId)} className="text-red-500 font-bold">
              X
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 font-bold">Total: ${totalPrice()}</div>
      <button onClick={clearCart} className="mt-2 px-3 py-1 border rounded bg-gray-200 w-full">
        Clear Cart
      </button>
    </div>
  );
}
