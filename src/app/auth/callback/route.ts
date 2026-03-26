import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPublicEnv, isSupabaseConfigured } from "@/lib/config/env";
import { setDemoSession } from "@/modules/auth/session";
import { consumeMagicLink } from "@/modules/store/demo-db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const next = url.searchParams.get("next") ?? "/cart";
  const code = url.searchParams.get("code");

  if (code && isSupabaseConfigured()) {
    const env = getPublicEnv();
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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

  await setDemoSession(payload.email);
  return NextResponse.redirect(new URL(payload.next || next, url));
}
