"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectIsCartOpen,
} from "@/features/cart/redux/cartSelectors";
import {
  setCartOpen,
} from "@/features/cart/redux/cartSlice";
import { CartContent } from "./CartContent";

export function CartPanel() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartOpen);

  const handleClose = () => dispatch(setCartOpen(false));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-xl"
          >
            <div className="flex h-full flex-col">
              {/* Custom Header for Mobile Drawer */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-lg font-bold">🧾 Tu pedido</h2>
                <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <CartContent onClose={handleClose} className="pb-6" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
