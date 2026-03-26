import { randomUUID } from "node:crypto";
import { ApiError } from "@/lib/api/http";
import type { DemoOrder } from "@/modules/store/demo-db";
import { deriveUserId, getDemoDb } from "@/modules/store/demo-db";

export type CheckoutItem = {
  product_id: string;
  quantity: number;
};

export function listOrdersForUser(email: string) {
  return getDemoDb().orders
    .filter((order) => order.user_email === email)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function createOrderForUser(email: string, items: CheckoutItem[]): DemoOrder {
  const db = getDemoDb();

  if (!items.length) {
    throw new ApiError("invalid_payload", "An order must include at least one item.", 400);
  }

  const normalizedItems = items.map((item) => ({ ...item }));
  const affectedProducts = normalizedItems.map((item) => {
    const product = db.products.find((candidate) => candidate.id === item.product_id);

    if (!product) {
      throw new ApiError("product_not_found", `Product ${item.product_id} was not found.`, 404);
    }

    if (product.stock < item.quantity) {
      throw new ApiError("stock_insufficient", `Insufficient stock for ${product.name}.`, 409, {
        product_id: product.id,
        stock: product.stock,
      });
    }

    return { product, quantity: item.quantity };
  });

  const orderId = randomUUID();
  const createdAt = new Date().toISOString();
  const orderItems = affectedProducts.map(({ product, quantity }) => ({
    id: randomUUID(),
    order_id: orderId,
    product_id: product.id,
    product_name: product.name,
    quantity,
    unit_price_cents: product.price_cents,
    subtotal_cents: product.price_cents * quantity,
  }));

  affectedProducts.forEach(({ product, quantity }) => {
    product.stock -= quantity;
    product.updated_at = createdAt;
  });

  const order: DemoOrder = {
    id: orderId,
    user_id: deriveUserId(email),
    user_email: email,
    status: "confirmed",
    total_cents: orderItems.reduce((total, item) => total + item.subtotal_cents, 0),
    created_at: createdAt,
    items: orderItems,
  };

  db.orders.unshift(order);

  return order;
}
