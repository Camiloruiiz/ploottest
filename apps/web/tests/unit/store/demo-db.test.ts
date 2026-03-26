import { beforeEach, describe, expect, it, vi } from "vitest";
import { consumeMagicLink, createMagicLink, deriveUserId, getDemoDb, resetDemoDb } from "@/modules/store/demo-db";
import { SHOPPER_EMAIL } from "../fixtures";

describe("demo db helpers", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    resetDemoDb();
  });

  it("derives a stable normalized user id", () => {
    expect(deriveUserId(SHOPPER_EMAIL)).toBe(deriveUserId("  SHOPPER@example.com  "));
  });

  it("creates and consumes a magic link once", () => {
    vi.stubEnv("PLOOTTEST_FIXED_NOW", "2025-01-07T12:00:00.000Z");

    const token = createMagicLink(SHOPPER_EMAIL, "/orders");
    expect(consumeMagicLink(token)).toEqual({
      email: SHOPPER_EMAIL,
      next: "/orders",
      expires_at: new Date("2025-01-07T12:15:00.000Z").getTime(),
    });
    expect(consumeMagicLink(token)).toBeNull();
  });

  it("expires magic links when their ttl has passed", () => {
    vi.stubEnv("PLOOTTEST_FIXED_NOW", "2025-01-07T12:00:00.000Z");
    const token = createMagicLink(SHOPPER_EMAIL, "/orders");

    vi.stubEnv("PLOOTTEST_FIXED_NOW", "2025-01-07T12:16:00.000Z");

    expect(consumeMagicLink(token)).toBeNull();
  });

  it("resets products, orders and magic links", () => {
    vi.stubEnv("PLOOTTEST_FIXED_NOW", "2025-01-07T12:00:00.000Z");
    const token = createMagicLink(SHOPPER_EMAIL, "/cart");
    getDemoDb().orders.push({
      id: "11111111-1111-4111-8111-111111111111",
      user_id: "22222222-2222-4222-8222-222222222222",
      user_email: SHOPPER_EMAIL,
      status: "confirmed",
      total_cents: 12900,
      created_at: "2025-01-07T12:00:00.000Z",
      items: [],
    });

    resetDemoDb();

    expect(getDemoDb().products).toHaveLength(9);
    expect(getDemoDb().orders).toEqual([]);
    expect(consumeMagicLink(token)).toBeNull();
  });
});
