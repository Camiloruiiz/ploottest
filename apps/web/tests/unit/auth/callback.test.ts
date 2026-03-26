import { afterEach, describe, expect, it, vi } from "vitest";

const exchangeCodeForSession = vi.fn();
const createRouteHandlerClient = vi.fn(async () => ({
  auth: {
    exchangeCodeForSession,
  },
}));

vi.mock("@/lib/db/supabase-server", () => ({
  createRouteHandlerClient,
}));

describe("auth callback route", () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  it("exchanges the auth code through the route handler client when Supabase is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("PLOOTTEST_FORCE_DEMO", "0");

    const { GET } = await import("@/app/auth/callback/route");
    const response = await GET(new Request("https://ploottest.local/auth/callback?code=abc123&next=%2Forders"));

    expect(createRouteHandlerClient).toHaveBeenCalled();
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc123");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://ploottest.local/orders");
  });
});
