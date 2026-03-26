export type CartItem = {
  product_id: string;
  name: string;
  unit_price_cents: number;
  quantity: number;
  stock: number;
};

export type CartState = {
  items: CartItem[];
};

export const initialCartState: CartState = {
  items: [],
};

export function addCartItem(state: CartState, item: Omit<CartItem, "quantity">) {
  const existing = state.items.find((entry) => entry.product_id === item.product_id);

  if (!existing) {
    return {
      items: [...state.items, { ...item, quantity: 1 }],
    };
  }

  return updateCartQuantity(state, item.product_id, existing.quantity + 1);
}

export function updateCartQuantity(state: CartState, productId: string, quantity: number) {
  if (quantity <= 0) {
    return {
      items: state.items.filter((item) => item.product_id !== productId),
    };
  }

  return {
    items: state.items.map((item) =>
      item.product_id === productId
        ? {
            ...item,
            quantity: Math.min(quantity, item.stock),
          }
        : item,
    ),
  };
}

export function removeCartItem(state: CartState, productId: string) {
  return {
    items: state.items.filter((item) => item.product_id !== productId),
  };
}

export function clearCart() {
  return initialCartState;
}

export function getCartTotal(state: CartState) {
  return state.items.reduce((total, item) => total + item.quantity * item.unit_price_cents, 0);
}
