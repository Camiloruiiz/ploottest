import { NextResponse } from "next/server";
import { ApiError, apiErrorResponse, ok } from "@/lib/api/http";
import { isSupabaseConfigured } from "@/lib/config/env";
import { createRouteHandlerClient } from "@/lib/db/supabase-server";
import { createOrderRequestSchema, orderListResponseSchema } from "@/lib/validation/orders";
import { getCurrentUser } from "@/modules/auth/session";
import { createOrderForUser, listOrdersForUser } from "@/modules/orders/service";

export async function GET() {
  if (!isSupabaseConfigured()) {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        apiErrorResponse(new ApiError("auth_required", "Authentication is required.", 401)),
        { status: 401 },
      );
    }

    const payload = orderListResponseSchema.parse({
      items: listOrdersForUser(user.email),
    });

    return NextResponse.json(ok(payload));
  }

  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      apiErrorResponse(new ApiError("auth_required", "Authentication is required.", 401)),
      { status: 401 },
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id,user_id,user_email,status,total_cents,created_at,items:order_items(id,order_id,product_id,quantity,unit_price_cents,subtotal_cents,product_name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      apiErrorResponse(new ApiError("orders_fetch_failed", error.message, 500)),
      { status: 500 },
    );
  }

  const payload = orderListResponseSchema.parse({ items: data ?? [] });
  return NextResponse.json(ok(payload));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createOrderRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      apiErrorResponse(new ApiError("invalid_payload", "Invalid order payload.", 400, parsed.error.flatten())),
      { status: 400 },
    );
  }

  if (!isSupabaseConfigured()) {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        apiErrorResponse(new ApiError("auth_required", "Authentication is required.", 401)),
        { status: 401 },
      );
    }

    try {
      const order = createOrderForUser(user.email, parsed.data.items);
      return NextResponse.json(ok(order), { status: 201 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(apiErrorResponse(error), { status: error.status });
      }

      return NextResponse.json(
        apiErrorResponse(new ApiError("orders_create_failed", "Unable to create the order.", 500)),
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    apiErrorResponse(new ApiError("orders_not_implemented", "Supabase checkout RPC is still pending.", 501)),
    { status: 501 },
  );
}
