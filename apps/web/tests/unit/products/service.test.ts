import { describe, expect, it } from "vitest";
import { fallbackProducts, filterProducts } from "@/modules/products/service";

describe("products service", () => {
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

  it("paginates the expanded catalog by default", () => {
    const result = filterProducts(fallbackProducts, {
      q: "",
      page: 1,
      pageSize: 6,
      inStock: "all",
      sort: "newest",
    });

    expect(result.items).toHaveLength(6);
    expect(result.meta.total).toBe(9);
    expect(result.meta.totalPages).toBe(2);
  });

  it("returns the sold out product when filtering out of stock items", () => {
    const result = filterProducts(fallbackProducts, {
      q: "",
      page: 1,
      pageSize: 6,
      inStock: "false",
      sort: "name_asc",
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.name).toBe("Summit Stove Kit");
    expect(result.meta.total).toBe(1);
  });
});
