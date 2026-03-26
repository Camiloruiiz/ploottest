import { describe, expect, it, vi } from "vitest";
import { createSupabaseOrderForUser, listSupabaseOrdersForUser } from "@/modules/orders/supabase";
import { ATLAS_ID, SHOPPER_EMAIL, SHOPPER_ID, createOrder } from "../fixtures";

describe("orders supabase service", () => {
  it("creates a real order through the checkout RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        ok: true,
        order: createOrder(),
      },
      error: null,
    });

    const order = await createSupabaseOrderForUser(
      { rpc },
      {
        id: SHOPPER_ID,
        email: SHOPPER_EMAIL,
      },
      [{ product_id: ATLAS_ID, quantity: 2 }],
    );

    expect(rpc).toHaveBeenCalledWith("checkout_order", {
      p_user_id: SHOPPER_ID,
      p_user_email: SHOPPER_EMAIL,
      p_items: [{ product_id: ATLAS_ID, quantity: 2 }],
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
          product_id: ATLAS_ID,
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
          id: SHOPPER_ID,
          email: SHOPPER_EMAIL,
        },
        [{ product_id: ATLAS_ID, quantity: 4 }],
      ),
    ).rejects.toMatchObject({
      code: "stock_insufficient",
      status: 409,
      detail: {
        product_id: ATLAS_ID,
        requested_quantity: 4,
        available_stock: 2,
      },
    });
  });

  it("lists only the authenticated user orders from Supabase", async () => {
    const order = createOrder();
    const orderMock = vi.fn().mockResolvedValue({ data: [order], error: null });
    const eqMock = vi.fn().mockReturnValue({ order: orderMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });

    const items = await listSupabaseOrdersForUser({ from: fromMock }, SHOPPER_ID);

    expect(fromMock).toHaveBeenCalledWith("orders");
    expect(selectMock).toHaveBeenCalledWith(
      "id,user_id,user_email,status,total_cents,created_at,items:order_items(id,order_id,product_id,quantity,unit_price_cents,subtotal_cents,product_name)",
    );
    expect(eqMock).toHaveBeenCalledWith("user_id", SHOPPER_ID);
    expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(items).toHaveLength(1);
    expect(items[0]?.user_email).toBe(SHOPPER_EMAIL);
  });
});
