import { afterEach, describe, expect, it, vi } from "vitest";

describe("supabase env detection", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("treats Supabase as configured when the public credentials exist", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    const { isSupabaseConfigured, shouldUseDemoMode } = await import("@/lib/config/env");

    expect(isSupabaseConfigured()).toBe(true);
    expect(shouldUseDemoMode()).toBe(false);
  });
});
