import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("class name helper", () => {
  it("merges tailwind classes and ignores falsy values", () => {
    expect(cn("px-2", undefined, "px-4", false && "hidden", "text-sm")).toBe("px-4 text-sm");
  });
});
