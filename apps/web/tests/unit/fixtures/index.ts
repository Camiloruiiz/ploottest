export const ATLAS_ID = "6df858c8-fccf-43dc-9d2f-08d4d5bf5f00";
export const MERCURY_ID = "b0f280b8-1515-4d8d-b91b-171dd6612872";
export const SHOPPER_EMAIL = "shopper@example.com";
export const SHOPPER_ID = "22222222-2222-4222-8222-222222222222";

export function createCheckoutItem(overrides: Partial<{ product_id: string; quantity: number }> = {}) {
  return {
    product_id: ATLAS_ID,
    quantity: 1,
    ...overrides,
  };
}

export function createOrderItem(
  overrides: Partial<{
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price_cents: number;
    subtotal_cents: number;
    product_name: string;
  }> = {},
) {
  return {
    id: "33333333-3333-4333-8333-333333333333",
    order_id: "11111111-1111-4111-8111-111111111111",
    product_id: ATLAS_ID,
    quantity: 2,
    unit_price_cents: 12900,
    subtotal_cents: 25800,
    product_name: "Atlas Trail Jacket",
    ...overrides,
  };
}

export function createOrder(
  overrides: Partial<{
    id: string;
    user_id: string;
    user_email: string;
    status: string;
    total_cents: number;
    created_at: string;
    items: ReturnType<typeof createOrderItem>[];
  }> = {},
) {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    user_id: SHOPPER_ID,
    user_email: SHOPPER_EMAIL,
    status: "confirmed",
    total_cents: 25800,
    created_at: "2025-01-01T00:00:00.000Z",
    items: [createOrderItem()],
    ...overrides,
  };
}
