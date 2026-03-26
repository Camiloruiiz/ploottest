import { describe, expect, it, vi } from "vitest";

describe("getRequiredEnv", () => {
  it("throws a readable error when env vars are missing", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    const { getRequiredEnv } = await import("@/lib/config/env");

    expect(() => getRequiredEnv()).toThrow(/Missing required environment variables/);
  });
});
