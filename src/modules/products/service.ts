import seedProducts from "@/lib/data/products.seed.json";
import { productQuerySchema, type ProductQuery } from "@/lib/validation/products";

export type ProductRecord = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type ProductListResult = {
  items: ProductRecord[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

function withTimestamps() {
  return seedProducts.map((product, index) => {
    const timestamp = new Date(Date.UTC(2025, 0, index + 1)).toISOString();

    return {
      ...product,
      created_at: timestamp,
      updated_at: timestamp,
    };
  });
}

export const fallbackProducts = withTimestamps();

export function filterProducts(products: ProductRecord[], queryInput: ProductQuery): ProductListResult {
  const query = productQuerySchema.parse(queryInput);
  const normalizedSearch = query.q.trim().toLowerCase();

  let filtered = [...products];

  if (normalizedSearch) {
    filtered = filtered.filter((product) => product.name.toLowerCase().includes(normalizedSearch));
  }

  if (query.inStock === "true") {
    filtered = filtered.filter((product) => product.stock > 0);
  }

  if (query.inStock === "false") {
    filtered = filtered.filter((product) => product.stock === 0);
  }

  switch (query.sort) {
    case "price_asc":
      filtered.sort((a, b) => a.price_cents - b.price_cents);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price_cents - a.price_cents);
      break;
    case "name_asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
    default:
      filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
      break;
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);
  const start = (page - 1) * query.pageSize;
  const items = filtered.slice(start, start + query.pageSize);

  return {
    items,
    meta: {
      page,
      pageSize: query.pageSize,
      total,
      totalPages,
    },
  };
}
