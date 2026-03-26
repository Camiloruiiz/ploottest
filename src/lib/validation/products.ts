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
    total: z.number().int().nonnegative(),
  }),
});
