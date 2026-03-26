import { afterEach, describe, expect, it, vi } from "vitest";

const signInWithOtp = vi.fn();
const createClient = vi.fn(() => ({
  auth: {
    signInWithOtp,
  },
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

describe("magic link route", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("uses NEXT_PUBLIC_SITE_URL to build the Supabase redirect", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://ploottest.vercel.app");
    vi.stubEnv("PLOOTTEST_FORCE_DEMO", "0");
    signInWithOtp.mockResolvedValue({ error: null });

    const { POST } = await import("@/app/api/v1/auth/magic-link/route");
    const response = await POST(
      new Request("http://localhost:3000/api/v1/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "shopper@example.com", next: "/cart" }),
      }),
    );

    expect(createClient).toHaveBeenCalled();
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "shopper@example.com",
      options: {
        emailRedirectTo: "https://ploottest.vercel.app/auth/callback?next=%2Fcart",
      },
    });
    expect(response.status).toBe(200);
  });

  it("falls back to the request origin when NEXT_PUBLIC_SITE_URL is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("PLOOTTEST_FORCE_DEMO", "0");
    signInWithOtp.mockResolvedValue({ error: null });

    const { POST } = await import("@/app/api/v1/auth/magic-link/route");
    await POST(
      new Request("http://localhost:3000/api/v1/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "shopper@example.com", next: "/cart" }),
      }),
    );

    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "shopper@example.com",
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback?next=%2Fcart",
      },
    });
  });
});
