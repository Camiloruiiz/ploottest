import { NextResponse } from "next/server";
import { productListResponseSchema } from "@/lib/validation/products";
import { ok } from "@/lib/api/http";
import { createRouteHandlerClient } from "@/lib/db/supabase-server";

export async function GET() {
  const supabase = await createRouteHandlerClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price_cents,stock,created_at,updated_at")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    return NextResponse.json(
      { error: { code: "products_fetch_failed", message: error.message } },
      { status: 500 },
    );
  }

  const payload = productListResponseSchema.parse({
    items: data ?? [],
    meta: {
      total: data?.length ?? 0,
    },
  });

  return NextResponse.json(ok(payload));
}
