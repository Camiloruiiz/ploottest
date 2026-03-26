import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const adminEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const rawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

const parsedPublicEnv = publicEnvSchema.safeParse(rawEnv);
const parsedAdminEnv = adminEnvSchema.safeParse(rawEnv);

export const envStatus = {
  NEXT_PUBLIC_SUPABASE_URL: Boolean(rawEnv.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(rawEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  SUPABASE_SERVICE_ROLE_KEY: Boolean(rawEnv.SUPABASE_SERVICE_ROLE_KEY),
};

export function isSupabaseConfigured() {
  return envStatus.NEXT_PUBLIC_SUPABASE_URL && envStatus.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function isSupabaseAdminConfigured() {
  return isSupabaseConfigured() && envStatus.SUPABASE_SERVICE_ROLE_KEY;
}

export function shouldUseDemoMode() {
  return process.env.PLOOTTEST_FORCE_DEMO === "1" || !isSupabaseConfigured();
}

export function getAdminEnv() {
  if (!parsedAdminEnv.success) {
    throw new Error(
      `Missing required admin environment variables: ${parsedAdminEnv.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`,
    );
  }

  return parsedAdminEnv.data;
}

export function getPublicEnv() {
  if (!parsedPublicEnv.success) {
    throw new Error(
      `Missing required public environment variables: ${parsedPublicEnv.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`,
    );
  }

  return parsedPublicEnv.data;
}
