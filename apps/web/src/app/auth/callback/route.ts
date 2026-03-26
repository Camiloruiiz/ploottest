import { NextResponse } from "next/server";
import { isSupabaseConfigured, shouldUseDemoMode } from "@/lib/config/env";
import { createRouteHandlerClient } from "@/lib/db/supabase-server";
import { getDemoSessionCookieConfig } from "@/modules/auth/session";
import { consumeMagicLink } from "@/modules/store/demo-db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const next = url.searchParams.get("next") ?? "/cart";
  const code = url.searchParams.get("code");

  if (code && !shouldUseDemoMode() && isSupabaseConfigured()) {
    const supabase = await createRouteHandlerClient();
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(new URL(next, url));
  }

  if (!token) {
    return NextResponse.redirect(new URL(`/auth?next=${encodeURIComponent(next)}`, url));
  }

  const payload = consumeMagicLink(token);

  if (!payload) {
    return NextResponse.redirect(new URL(`/auth?next=${encodeURIComponent(next)}`, url));
  }

  const response = NextResponse.redirect(new URL(payload.next || next, url));
  const cookie = getDemoSessionCookieConfig(payload.email);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
