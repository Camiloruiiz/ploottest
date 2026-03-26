import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "@/lib/format";

describe("format helpers", () => {
  it("formats currency in usd", () => {
    expect(formatCurrency(12900)).toBe("$129.00");
  });

  it("formats dates for the us locale", () => {
    expect(formatDate("2025-01-07T12:00:00.000Z")).toBe(
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date("2025-01-07T12:00:00.000Z")),
    );
  });
});
