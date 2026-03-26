import { describe, expect, it } from "vitest";
import { addCartItem, getCartTotal, initialCartState, removeCartItem, updateCartQuantity } from "@/modules/cart/cart";

describe("cart domain", () => {
  it("adds items and computes totals", () => {
    const withItem = addCartItem(initialCartState, {
      product_id: "1",
      name: "Atlas Trail Jacket",
      unit_price_cents: 12900,
      stock: 4,
    });

    const updated = updateCartQuantity(withItem, "1", 2);

    expect(updated.items[0]?.quantity).toBe(2);
    expect(getCartTotal(updated)).toBe(25800);
  });

  it("removes items when quantity goes to zero", () => {
    const withItem = addCartItem(initialCartState, {
      product_id: "1",
      name: "Atlas Trail Jacket",
      unit_price_cents: 12900,
      stock: 4,
    });

    expect(removeCartItem(withItem, "1").items).toHaveLength(0);
  });
});
