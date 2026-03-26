import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, shouldUseDemoMode } from "@/lib/config/env";
import { createRouteHandlerClient } from "@/lib/db/supabase-server";
import { deriveUserId } from "@/modules/store/demo-db";

const SESSION_COOKIE = "ploottest_session";

export type SessionUser = {
  id: string;
  email: string;
  mode: "demo" | "supabase";
};

export function encodeDemoSession(email: string) {
  return Buffer.from(JSON.stringify({ email }), "utf8").toString("base64url");
}

function decodeSession(value: string) {
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(decoded) as { email?: string };
    return parsed.email ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  if (!shouldUseDemoMode() && isSupabaseConfigured()) {
    try {
      const supabase = await createRouteHandlerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        return {
          id: user.id,
          email: user.email,
          mode: "supabase" as const,
        };
      }
    } catch {
      // Fall back to demo mode when env exists but auth is unavailable.
    }
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;

  if (!value) {
    return null;
  }

  const email = decodeSession(value);

  if (!email) {
    return null;
  }

  return {
    id: deriveUserId(email),
    email,
    mode: "demo" as const,
  };
}

export async function requireCurrentUser(next = "/") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/auth?next=${encodeURIComponent(next)}`);
  }

  return user;
}

export async function setDemoSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeDemoSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function getDemoSessionCookieConfig(email: string) {
  return {
    name: SESSION_COOKIE,
    value: encodeDemoSession(email),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export async function clearSession() {
  if (!shouldUseDemoMode() && isSupabaseConfigured()) {
    try {
      const supabase = await createRouteHandlerClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore and continue clearing local cookie.
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function gravatarHash(email: string) {
  return createHash("md5").update(email.trim().toLowerCase()).digest("hex");
}
