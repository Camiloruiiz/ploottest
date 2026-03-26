import { describe, expect, it } from "vitest";
import { checkoutRpcResponseSchema, createOrderRequestSchema } from "@/lib/validation/orders";
import { createCheckoutItem, createOrder } from "../fixtures";

describe("orders validation", () => {
  it("rejects empty order payloads", () => {
    expect(() => createOrderRequestSchema.parse({ items: [] })).toThrow();
  });

  it("accepts checkout rpc success payloads", () => {
    expect(
      checkoutRpcResponseSchema.parse({
        ok: true,
        order: createOrder({ items: [] }),
      }).ok,
    ).toBe(true);
  });

  it("accepts checkout rpc error payloads", () => {
    expect(
      checkoutRpcResponseSchema.parse({
        ok: false,
        error_code: "stock_insufficient",
        error_message: "Insufficient stock.",
        error_detail: { product_id: createCheckoutItem().product_id },
      }).ok,
    ).toBe(false);
  });
});
