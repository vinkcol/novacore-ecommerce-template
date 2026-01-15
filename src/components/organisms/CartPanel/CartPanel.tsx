"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/molecules/CartItem";
import { Price } from "@/components/atoms/Price";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CheckoutModal } from "@/features/checkout/components/CheckoutModal";
import {
  selectCartItems,
  selectIsCartOpen,
  selectCartTotals,
} from "@/features/cart/redux/cartSelectors";
import {
  setCartOpen,
  removeFromCart,
  updateQuantity,
} from "@/features/cart/redux/cartSlice";
import { useState } from "react";

export function CartPanel() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartOpen);
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleClose = () => dispatch(setCartOpen(false));

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />
        )}

        {isOpen && (
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-lg font-semibold">
                  Carrito de Compras ({totals.itemCount})
                </h2>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                    <div>
                      <h3 className="mb-1 font-semibold">Tu carrito está vacío</h3>
                      <p className="text-sm text-muted-foreground">
                        Empieza a comprar para agregar productos
                      </p>
                    </div>
                    <Button onClick={handleClose}>Seguir Comprando</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t px-6 py-4">
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <Price amount={totals.subtotal} className="text-sm" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-sm">
                        {totals.shipping === 0
                          ? "Gratis"
                          : `$${totals.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impuesto</span>
                      <span className="text-sm">${totals.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-base font-semibold">
                      <span>Total</span>
                      <Price amount={totals.total} />
                    </div>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Pagar contraentrega
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
