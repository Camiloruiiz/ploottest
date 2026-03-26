import { productQuerySchema, type ProductQuery } from "@/lib/validation/products";

export function parseProductQuery(input: URLSearchParams | Record<string, string | string[] | undefined>) {
  if (input instanceof URLSearchParams) {
    return productQuerySchema.parse(Object.fromEntries(input.entries()));
  }

  const normalized: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(input)) {
    normalized[key] = Array.isArray(value) ? value[0] : value;
  }

  return productQuerySchema.parse(normalized);
}

export function buildProductQueryString(query: Partial<ProductQuery>) {
  const params = new URLSearchParams();

  if (query.q) {
    params.set("q", query.q);
  }

  if (query.page && query.page !== 1) {
    params.set("page", String(query.page));
  }

  if (query.pageSize && query.pageSize !== 6) {
    params.set("pageSize", String(query.pageSize));
  }

  if (query.inStock && query.inStock !== "all") {
    params.set("inStock", query.inStock);
  }

  if (query.sort && query.sort !== "newest") {
    params.set("sort", query.sort);
  }

  return params.toString();
}
