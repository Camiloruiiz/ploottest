import { describe, expect, it } from "vitest";
import { magicLinkRequestSchema } from "@/lib/validation/auth";

describe("auth validation", () => {
  it("normalizes magic link requests", () => {
    expect(magicLinkRequestSchema.parse({ email: "shopper@example.com" })).toEqual({
      email: "shopper@example.com",
      next: "/",
    });
  });
});
