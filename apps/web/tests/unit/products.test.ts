import { describe, expect, it } from "vitest";
import { parseProductQuery } from "@/modules/products/query";
import { fallbackProducts, filterProducts } from "@/modules/products/service";

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

  it("filters and sorts products", () => {
    const result = filterProducts(fallbackProducts, {
      q: "pack",
      page: 1,
      pageSize: 6,
      inStock: "true",
      sort: "price_desc",
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.name).toBe("Mercury Field Pack");
    expect(result.meta.totalPages).toBe(1);
  });
});
