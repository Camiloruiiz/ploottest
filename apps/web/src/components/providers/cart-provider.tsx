"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import {
  addCartItem,
  clearCart,
  getCartTotal,
  initialCartState,
  removeCartItem,
  updateCartQuantity,
  type CartItem,
  type CartState,
} from "@/modules/cart/cart";

type CartContextValue = {
  state: CartState;
  itemCount: number;
  totalCents: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

type CartAction =
  | { type: "hydrate"; payload: CartState }
  | { type: "add"; payload: Omit<CartItem, "quantity"> }
  | { type: "setQuantity"; payload: { productId: string; quantity: number } }
  | { type: "remove"; payload: { productId: string } }
  | { type: "clear" };

const STORAGE_KEY = "ploottest_cart";

const CartContext = createContext<CartContextValue | null>(null);

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "add":
      return addCartItem(state, action.payload);
    case "setQuantity":
      return updateCartQuantity(state, action.payload.productId, action.payload.quantity);
    case "remove":
      return removeCartItem(state, action.payload.productId);
    case "clear":
      return clearCart();
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialCartState, () => {
    if (typeof window === "undefined") {
      return initialCartState;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartState) : initialCartState;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return initialCartState;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      itemCount: state.items.reduce((total, item) => total + item.quantity, 0),
      totalCents: getCartTotal(state),
      addItem: (item) => dispatch({ type: "add", payload: item }),
      setQuantity: (productId, quantity) => dispatch({ type: "setQuantity", payload: { productId, quantity } }),
      removeItem: (productId) => dispatch({ type: "remove", payload: { productId } }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
