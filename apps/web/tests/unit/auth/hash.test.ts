import { describe, expect, it } from "vitest";
import { parseAuthFragment } from "@/modules/auth/hash";

describe("auth hash parsing", () => {
  it("extracts a Supabase implicit-flow fragment", () => {
    expect(
      parseAuthFragment(
        "#access_token=token123&refresh_token=refresh456&type=magiclink",
        "?next=%2Forders",
      ),
    ).toEqual({
      accessToken: "token123",
      refreshToken: "refresh456",
      next: "/orders",
    });
  });

  it("returns null when the fragment is not an auth session", () => {
    expect(parseAuthFragment("#type=magiclink", "")).toBeNull();
  });
});
