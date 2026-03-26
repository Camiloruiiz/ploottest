import { ApiError } from "@/lib/api/http";
import { checkoutRpcResponseSchema, orderListResponseSchema } from "@/lib/validation/orders";
import type { CheckoutItem } from "@/modules/orders/service";

export const ORDER_SELECT =
  "id,user_id,user_email,status,total_cents,created_at,items:order_items(id,order_id,product_id,quantity,unit_price_cents,subtotal_cents,product_name)";

type RpcResult = {
  data: unknown;
  error: { message: string } | null;
};

type QueryResult = {
  data: unknown;
  error: { message: string } | null;
};

type Awaitable<T> = PromiseLike<T> | T;

type SupabaseRpcClient = {
  rpc(name: string, args: Record<string, unknown>): Awaitable<RpcResult>;
};

type SupabaseOrderQueryClient = {
  from(table: string): {
    select(columns: string): {
      eq(column: string, value: string): {
        order(column: string, options: { ascending: boolean }): Awaitable<QueryResult>;
      };
    };
  };
};

function statusFromErrorCode(code: string) {
  switch (code) {
    case "auth_required":
      return 401;
    case "forbidden":
      return 403;
    case "product_not_found":
      return 404;
    case "stock_insufficient":
      return 409;
    case "invalid_payload":
      return 400;
    default:
      return 500;
  }
}

export async function createSupabaseOrderForUser(
  client: SupabaseRpcClient,
  user: { id: string; email: string },
  items: CheckoutItem[],
) {
  const { data, error } = await client.rpc("checkout_order", {
    p_user_id: user.id,
    p_user_email: user.email,
    p_items: items,
  });

  if (error) {
    throw new ApiError("orders_create_failed", error.message, 500);
  }

  const payload = checkoutRpcResponseSchema.parse(data);

  if (!payload.ok) {
    throw new ApiError(
      payload.error_code,
      payload.error_message,
      statusFromErrorCode(payload.error_code),
      payload.error_detail ?? null,
    );
  }

  return payload.order;
}

export async function listSupabaseOrdersForUser(client: SupabaseOrderQueryClient, userId: string) {
  const { data, error } = await client
    .from("orders")
    .select(ORDER_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new ApiError("orders_fetch_failed", error.message, 500);
  }

  return orderListResponseSchema.parse({ items: data ?? [] }).items;
}
