import { z } from "zod";

export const orderSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  status: z.string().min(1),
  total_cents: z.number().int().nonnegative(),
  created_at: z.string(),
});

export const orderItemInputSchema = z.object({
  product_id: z.uuid(),
  quantity: z.number().int().positive(),
});

export const createOrderRequestSchema = z.object({
  items: z.array(orderItemInputSchema).min(1),
});

export const orderListResponseSchema = z.object({
  items: z.array(orderSchema),
});
