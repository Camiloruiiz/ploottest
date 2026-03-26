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

  it("prefers NEXT_PUBLIC_SITE_URL as the canonical redirect base", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://ploottest.vercel.app");

    const { getCanonicalSiteUrl } = await import("@/lib/config/env");

    expect(getCanonicalSiteUrl("http://localhost:3000/auth").toString()).toBe("https://ploottest.vercel.app/");
  });

  it("falls back to the request origin when NEXT_PUBLIC_SITE_URL is absent", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

    const { getCanonicalSiteUrl } = await import("@/lib/config/env");

    expect(getCanonicalSiteUrl("http://localhost:3000/auth").origin).toBe("http://localhost:3000");
  });
});
