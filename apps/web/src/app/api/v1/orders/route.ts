import { NextResponse } from "next/server";
import { ApiError, apiErrorResponse, ok } from "@/lib/api/http";
import { isSupabaseConfigured, shouldUseDemoMode } from "@/lib/config/env";
import { createRouteHandlerClient } from "@/lib/db/supabase-server";
import { createOrderRequestSchema, orderListResponseSchema } from "@/lib/validation/orders";
import { getCurrentUser } from "@/modules/auth/session";
import { createOrderForUser, listOrdersForUser } from "@/modules/orders/service";
import { createSupabaseOrderForUser, listSupabaseOrdersForUser } from "@/modules/orders/supabase";

export async function GET(request: Request) {
  if (shouldUseDemoMode() || !isSupabaseConfigured()) {
    const user = await getCurrentUser();
    const fallbackEmail = request.headers.get("x-demo-user");
    const email = user?.email ?? fallbackEmail;

    if (!email) {
      return NextResponse.json(
        apiErrorResponse(new ApiError("auth_required", "Authentication is required.", 401)),
        { status: 401 },
      );
    }

    const payload = orderListResponseSchema.parse({
      items: listOrdersForUser(email),
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

  try {
    const items = await listSupabaseOrdersForUser(supabase as any, user.id);
    const payload = orderListResponseSchema.parse({ items });
    return NextResponse.json(ok(payload));
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(apiErrorResponse(error), { status: error.status });
    }

    return NextResponse.json(
      apiErrorResponse(new ApiError("orders_fetch_failed", "Unable to load orders.", 500)),
      { status: 500 },
    );
  }
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

  if (shouldUseDemoMode() || !isSupabaseConfigured()) {
    const user = await getCurrentUser();
    const fallbackEmail = request.headers.get("x-demo-user");
    const email = user?.email ?? fallbackEmail;

    if (!email) {
      return NextResponse.json(
        apiErrorResponse(new ApiError("auth_required", "Authentication is required.", 401)),
        { status: 401 },
      );
    }

    try {
      const order = createOrderForUser(email, parsed.data.items);
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

  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json(
      apiErrorResponse(new ApiError("auth_required", "Authentication is required.", 401)),
      { status: 401 },
    );
  }

  try {
    const order = await createSupabaseOrderForUser(
      supabase as any,
      {
        id: user.id,
        email: user.email,
      },
      parsed.data.items,
    );

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
