import { beforeEach, describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api/http";
import { createOrderForUser, listOrdersForUser } from "@/modules/orders/service";
import { resetDemoDb } from "@/modules/store/demo-db";

describe("orders service", () => {
  beforeEach(() => {
    resetDemoDb();
  });

  it("creates an order and decreases stock", () => {
    const order = createOrderForUser("shopper@example.com", [
      {
        product_id: "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00",
        quantity: 2,
      },
    ]);

    expect(order.total_cents).toBe(25800);
    expect(listOrdersForUser("shopper@example.com")).toHaveLength(1);
  });

  it("rejects insufficient stock", () => {
    expect(() =>
      createOrderForUser("shopper@example.com", [
        {
          product_id: "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00",
          quantity: 200,
        },
      ]),
    ).toThrow(ApiError);
  });
});
