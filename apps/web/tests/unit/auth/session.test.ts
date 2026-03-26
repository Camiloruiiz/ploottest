import { afterEach, describe, expect, it, vi } from "vitest";

const cookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};
const cookiesMock = vi.fn(async () => cookieStore);
const redirectMock = vi.fn();
const getUserMock = vi.fn();
const signOutMock = vi.fn();
const createRouteHandlerClient = vi.fn(async () => ({
  auth: {
    getUser: getUserMock,
    signOut: signOutMock,
  },
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/db/supabase-server", () => ({
  createRouteHandlerClient,
}));

describe("auth session helpers", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    delete process.env.PLOOTTEST_FIXED_NOW;
    cookieStore.get.mockReset();
    cookieStore.set.mockReset();
    cookieStore.delete.mockReset();
    getUserMock.mockReset();
    signOutMock.mockReset();
  });

  it("encodes a demo session cookie payload", async () => {
    const { encodeDemoSession } = await import("@/modules/auth/session");
    expect(Buffer.from(encodeDemoSession("shopper@example.com"), "base64url").toString("utf8")).toBe(
      JSON.stringify({ email: "shopper@example.com" }),
    );
  });

  it("returns a demo user from a valid cookie", async () => {
    const encoded = Buffer.from(JSON.stringify({ email: "shopper@example.com" }), "utf8").toString("base64url");
    cookieStore.get.mockReturnValue({ value: encoded });

    const { getCurrentUser } = await import("@/modules/auth/session");
    const user = await getCurrentUser();

    expect(user).toMatchObject({
      email: "shopper@example.com",
      mode: "demo",
    });
  });

  it("returns null when the cookie is invalid", async () => {
    cookieStore.get.mockReturnValue({ value: "not-base64" });

    const { getCurrentUser } = await import("@/modules/auth/session");

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it("returns the supabase user when supabase auth succeeds", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("PLOOTTEST_FORCE_DEMO", "0");
    getUserMock.mockResolvedValue({
      data: {
        user: {
          id: "22222222-2222-4222-8222-222222222222",
          email: "shopper@example.com",
        },
      },
    });

    const { getCurrentUser } = await import("@/modules/auth/session");
    const user = await getCurrentUser();

    expect(createRouteHandlerClient).toHaveBeenCalled();
    expect(user).toEqual({
      id: "22222222-2222-4222-8222-222222222222",
      email: "shopper@example.com",
      mode: "supabase",
    });
  });

  it("falls back to demo mode when supabase auth fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("PLOOTTEST_FORCE_DEMO", "0");
    getUserMock.mockRejectedValue(new Error("boom"));
    cookieStore.get.mockReturnValue({
      value: Buffer.from(JSON.stringify({ email: "shopper@example.com" }), "utf8").toString("base64url"),
    });

    const { getCurrentUser } = await import("@/modules/auth/session");
    const user = await getCurrentUser();

    expect(user).toMatchObject({
      email: "shopper@example.com",
      mode: "demo",
    });
  });

  it("returns the cookie config for demo sessions", async () => {
    const { getDemoSessionCookieConfig } = await import("@/modules/auth/session");
    expect(getDemoSessionCookieConfig("shopper@example.com")).toMatchObject({
      name: "ploottest_session",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
        maxAge: 604800,
      },
    });
  });

  it("clears the local cookie even when supabase sign out fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("PLOOTTEST_FORCE_DEMO", "0");
    signOutMock.mockRejectedValue(new Error("signout failed"));

    const { clearSession } = await import("@/modules/auth/session");
    await clearSession();

    expect(cookieStore.delete).toHaveBeenCalledWith("ploottest_session");
  });

  it("hashes emails for gravatar consistently", async () => {
    const { gravatarHash } = await import("@/modules/auth/session");
    expect(gravatarHash(" SHOPPER@example.com ")).toBe("2db01f61391e64daca47444941c407a7");
  });
});
