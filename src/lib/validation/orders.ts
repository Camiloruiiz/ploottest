import { z } from "zod";

export const orderItemSchema = z.object({
  id: z.uuid(),
  order_id: z.uuid(),
  product_id: z.uuid(),
  quantity: z.number().int().positive(),
  unit_price_cents: z.number().int().nonnegative(),
  subtotal_cents: z.number().int().nonnegative(),
  product_name: z.string().min(1),
});

export const orderSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  user_email: z.email(),
  status: z.string().min(1),
  total_cents: z.number().int().nonnegative(),
  created_at: z.string(),
  items: z.array(orderItemSchema),
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
