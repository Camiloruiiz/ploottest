import { beforeEach, describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api/http";
import { createOrderForUser, listOrdersForUser } from "@/modules/orders/service";
import { resetDemoDb } from "@/modules/store/demo-db";
import { ATLAS_ID, SHOPPER_EMAIL } from "../fixtures";

describe("orders service", () => {
  beforeEach(() => {
    delete process.env.PLOOTTEST_FIXED_NOW;
    resetDemoDb();
  });

  it("creates an order and decreases stock", () => {
    const order = createOrderForUser(SHOPPER_EMAIL, [
      {
        product_id: ATLAS_ID,
        quantity: 2,
      },
    ]);

    expect(order.total_cents).toBe(25800);
    expect(order.items[0]).toMatchObject({
      product_name: "Atlas Trail Jacket",
      subtotal_cents: 25800,
    });
    expect(listOrdersForUser(SHOPPER_EMAIL)).toHaveLength(1);
  });

  it("rejects insufficient stock", () => {
    expect(() =>
      createOrderForUser(SHOPPER_EMAIL, [
        {
          product_id: ATLAS_ID,
          quantity: 200,
        },
      ]),
    ).toThrow(ApiError);
  });

  it("rejects empty orders and unknown products", () => {
    expect(() => createOrderForUser(SHOPPER_EMAIL, [])).toThrow(ApiError);
    expect(() =>
      createOrderForUser(SHOPPER_EMAIL, [
        {
          product_id: "11111111-1111-4111-8111-111111111111",
          quantity: 1,
        },
      ]),
    ).toThrow(ApiError);
  });

  it("lists newer orders first", () => {
    process.env.PLOOTTEST_FIXED_NOW = "2025-01-07T12:00:00.000Z";
    createOrderForUser(SHOPPER_EMAIL, [{ product_id: ATLAS_ID, quantity: 1 }]);
    process.env.PLOOTTEST_FIXED_NOW = "2025-01-07T12:05:00.000Z";
    createOrderForUser(SHOPPER_EMAIL, [{ product_id: ATLAS_ID, quantity: 1 }]);

    const orders = listOrdersForUser(SHOPPER_EMAIL);

    expect(orders).toHaveLength(2);
    expect(orders[0]?.created_at > orders[1]?.created_at).toBe(true);
  });
});
