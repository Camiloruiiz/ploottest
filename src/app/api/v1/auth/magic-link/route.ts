import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ApiError, apiErrorResponse, ok } from "@/lib/api/http";
import { getPublicEnv, isSupabaseConfigured, shouldUseDemoMode } from "@/lib/config/env";
import { magicLinkRequestSchema } from "@/lib/validation/auth";
import { getDemoSessionCookieConfig } from "@/modules/auth/session";
import { createMagicLink } from "@/modules/store/demo-db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = magicLinkRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      apiErrorResponse(new ApiError("invalid_payload", "A valid email is required.", 400, parsed.error.flatten())),
      { status: 400 },
    );
  }

  if (!shouldUseDemoMode() && isSupabaseConfigured()) {
    const env = getPublicEnv();
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.searchParams.set("next", parsed.data.next);
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      return NextResponse.json(apiErrorResponse(new ApiError("auth_unavailable", error.message, 500)), {
        status: 500,
      });
    }

    return NextResponse.json(
      ok({
        mode: "supabase",
        message: "Magic link sent. Check your inbox.",
      }),
    );
  }

  const token = createMagicLink(parsed.data.email, parsed.data.next);
  const previewUrl = new URL(parsed.data.next, request.url);
  previewUrl.searchParams.set("demoToken", token);

  const response = NextResponse.json(
    ok({
      mode: "demo",
      message: "Demo magic link generated for local development.",
      previewUrl: previewUrl.toString(),
    }),
  );
  const cookie = getDemoSessionCookieConfig(parsed.data.email);
  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return response;
}
