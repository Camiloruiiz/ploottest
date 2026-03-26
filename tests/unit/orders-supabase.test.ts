import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/http";
import { createSupabaseOrderForUser, listSupabaseOrdersForUser } from "@/modules/orders/supabase";

function buildOrder() {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    user_id: "22222222-2222-4222-8222-222222222222",
    user_email: "shopper@example.com",
    status: "confirmed",
    total_cents: 25800,
    created_at: "2025-01-01T00:00:00.000Z",
    items: [
      {
        id: "33333333-3333-4333-8333-333333333333",
        order_id: "11111111-1111-4111-8111-111111111111",
        product_id: "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00",
        quantity: 2,
        unit_price_cents: 12900,
        subtotal_cents: 25800,
        product_name: "Atlas Trail Jacket",
      },
    ],
  };
}

describe("supabase orders service", () => {
  it("creates a real order through the checkout RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        ok: true,
        order: buildOrder(),
      },
      error: null,
    });

    const order = await createSupabaseOrderForUser(
      { rpc },
      {
        id: "22222222-2222-4222-8222-222222222222",
        email: "shopper@example.com",
      },
      [{ product_id: "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00", quantity: 2 }],
    );

    expect(rpc).toHaveBeenCalledWith("checkout_order", {
      p_user_id: "22222222-2222-4222-8222-222222222222",
      p_user_email: "shopper@example.com",
      p_items: [{ product_id: "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00", quantity: 2 }],
    });
    expect(order.total_cents).toBe(25800);
    expect(order.items).toHaveLength(1);
  });

  it("maps structured stock errors from the checkout RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        ok: false,
        error_code: "stock_insufficient",
        error_message: "Insufficient stock for Atlas Trail Jacket.",
        error_detail: {
          product_id: "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00",
          requested_quantity: 4,
          available_stock: 2,
        },
      },
      error: null,
    });

    await expect(
      createSupabaseOrderForUser(
        { rpc },
        {
          id: "22222222-2222-4222-8222-222222222222",
          email: "shopper@example.com",
        },
        [{ product_id: "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00", quantity: 4 }],
      ),
    ).rejects.toMatchObject({
      code: "stock_insufficient",
      status: 409,
      detail: {
        product_id: "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00",
        requested_quantity: 4,
        available_stock: 2,
      },
    });
  });

  it("lists only the authenticated user orders from Supabase", async () => {
    const order = buildOrder();
    const orderMock = vi.fn().mockResolvedValue({ data: [order], error: null });
    const eqMock = vi.fn().mockReturnValue({ order: orderMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    const items = await listSupabaseOrdersForUser({ from: fromMock }, "22222222-2222-4222-8222-222222222222");

    expect(fromMock).toHaveBeenCalledWith("orders");
    expect(selectMock).toHaveBeenCalledWith(
      "id,user_id,user_email,status,total_cents,created_at,items:order_items(id,order_id,product_id,quantity,unit_price_cents,subtotal_cents,product_name)",
    );
    expect(eqMock).toHaveBeenCalledWith("user_id", "22222222-2222-4222-8222-222222222222");
    expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(items).toHaveLength(1);
    expect(items[0]?.user_email).toBe("shopper@example.com");
  });
});
