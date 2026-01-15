"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Minus, Plus, X } from "lucide-react";
import { useState } from "react";

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    alert("Order placed successfully! Thank you for your purchase.");
    clearCart();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-2xl z-40 bg-primary text-primary-foreground hover:scale-110 transition-transform"
        size="icon"
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-background">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          )}
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 px-4"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 w-full max-w-sm h-full bg-background shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <h2 className="text-lg font-bold">Your Cart</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                    <ShoppingCart className="h-12 w-12" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-3 items-center p-2 rounded-lg border border-transparent hover:border-border transition-colors group"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-md bg-muted"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                          <p className="text-primary font-bold text-sm mt-0.5">${item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-sm"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-sm"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-4 border-t bg-muted/30 space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-xl font-bold">${totalPrice().toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={clearCart}>
                      Clear
                    </Button>
                    <Button onClick={handleCheckout}>
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

