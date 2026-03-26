import { describe, expect, it, vi } from "vitest";

describe("getAdminEnv", () => {
  it("throws a readable error when admin env vars are missing", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    const { getAdminEnv } = await import("@/lib/config/env");

    expect(() => getAdminEnv()).toThrow(/Missing required admin environment variables/);
  });
});
