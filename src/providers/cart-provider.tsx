"use client";

import { createContext, ReactNode, use, useContext, useMemo } from "react";

import { GetAwaitedCartReturn, GetCartReturn } from "@/lib/type";

type CartContextType = {
  cart: GetAwaitedCartReturn | undefined;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
  children,
  cartPromise,
}: {
  children: ReactNode;
  cartPromise: GetCartReturn;
}) => {
  const cart = use(cartPromise);

  const value = useMemo(
    () => ({
      cart,
    }),
    [cart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
