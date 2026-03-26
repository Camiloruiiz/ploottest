import { NextResponse } from "next/server";
import { ApiError, apiErrorResponse, ok } from "@/lib/api/http";
import { isSupabaseConfigured, shouldUseDemoMode } from "@/lib/config/env";
import { productListResponseSchema } from "@/lib/validation/products";
import { createRouteHandlerClient } from "@/lib/db/supabase-server";
import { parseProductQuery } from "@/modules/products/query";
import { filterProducts } from "@/modules/products/service";
import { getDemoDb } from "@/modules/store/demo-db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = parseProductQuery(url.searchParams);
  const fallbackPayload = productListResponseSchema.parse(filterProducts(getDemoDb().products, query));

  if (shouldUseDemoMode() || !isSupabaseConfigured()) {
    return NextResponse.json(ok(fallbackPayload));
  }

  const supabase = await createRouteHandlerClient();
  let queryBuilder = supabase.from("products").select("id,name,description,price_cents,stock,created_at,updated_at", {
    count: "exact",
  });

  if (query.q) {
    queryBuilder = queryBuilder.ilike("name", `%${query.q}%`);
  }

  if (query.inStock === "true") {
    queryBuilder = queryBuilder.gt("stock", 0);
  }

  if (query.inStock === "false") {
    queryBuilder = queryBuilder.eq("stock", 0);
  }

  switch (query.sort) {
    case "price_asc":
      queryBuilder = queryBuilder.order("price_cents", { ascending: true });
      break;
    case "price_desc":
      queryBuilder = queryBuilder.order("price_cents", { ascending: false });
      break;
    case "name_asc":
      queryBuilder = queryBuilder.order("name", { ascending: true });
      break;
    case "newest":
    default:
      queryBuilder = queryBuilder.order("created_at", { ascending: false });
      break;
  }

  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;
  const { data, error, count } = await queryBuilder.range(from, to);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(ok(fallbackPayload), {
        headers: {
          "x-ploottest-products-source": "demo-fallback",
          "x-ploottest-products-error": error.code ?? "unknown_error",
        },
      });
    }

    return NextResponse.json(
      apiErrorResponse(new ApiError("products_fetch_failed", error.message, 500)),
      { status: 500 },
    );
  }

  const payload = productListResponseSchema.parse({
    items: data ?? [],
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total: count ?? data?.length ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? data?.length ?? 0) / query.pageSize)),
    },
  });

  return NextResponse.json(ok(payload));
}
