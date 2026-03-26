import { z } from "zod";

export const productSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  price_cents: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const productSeedSchema = productSchema.extend({
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const productListResponseSchema = z.object({
  items: z.array(productSchema),
  meta: z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().positive(),
  }),
});

export const productSortValues = ["newest", "price_asc", "price_desc", "name_asc"] as const;

export const productQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(24).optional().default(6),
  inStock: z.enum(["all", "true", "false"]).optional().default("all"),
  sort: z.enum(productSortValues).optional().default("newest"),
});

export type ProductSort = (typeof productSortValues)[number];
export type ProductQuery = z.infer<typeof productQuerySchema>;
