import { NextResponse } from "next/server";
import { ApiError, apiErrorResponse, ok } from "@/lib/api/http";
import { createRouteHandlerClient } from "@/lib/db/supabase-server";
import { createOrderRequestSchema, orderListResponseSchema } from "@/lib/validation/orders";

export async function GET() {
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
    .select("id,user_id,status,total_cents,created_at")
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

  const body = await request.json().catch(() => null);
  const parsed = createOrderRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      apiErrorResponse(new ApiError("invalid_payload", "Invalid order payload.", 400, parsed.error.flatten())),
      { status: 400 },
    );
  }

  return NextResponse.json(
    apiErrorResponse(
      new ApiError(
        "orders_not_implemented",
        "Atomic checkout is planned for the next implementation phase.",
        501,
        { itemCount: parsed.data.items.length },
      ),
    ),
    { status: 501 },
  );
}
