import { describe, expect, it } from "vitest";
import { buildProductQueryString, parseProductQuery } from "@/modules/products/query";
import { productQuerySchema } from "@/lib/validation/products";

describe("products query", () => {
  it("applies defaults", () => {
    expect(parseProductQuery({})).toEqual({
      q: "",
      page: 1,
      pageSize: 6,
      inStock: "all",
      sort: "newest",
    });
  });

  it("parses URLSearchParams and record arrays consistently", () => {
    expect(parseProductQuery(new URLSearchParams("q=Atlas&page=2&pageSize=3&inStock=true&sort=name_asc"))).toEqual({
      q: "Atlas",
      page: 2,
      pageSize: 3,
      inStock: "true",
      sort: "name_asc",
    });

    expect(parseProductQuery({ q: ["Mercury", "ignored"], page: "3" })).toMatchObject({
      q: "Mercury",
      page: 3,
    });
  });

  it("serializes only non-default query params", () => {
    expect(buildProductQueryString({})).toBe("");
    expect(buildProductQueryString({ q: "Atlas", page: 2, sort: "price_desc", inStock: "true" })).toBe(
      "q=Atlas&page=2&inStock=true&sort=price_desc",
    );
  });

  it("enforces the maximum page size", () => {
    expect(() => productQuerySchema.parse({ pageSize: 25 })).toThrow();
  });
});
