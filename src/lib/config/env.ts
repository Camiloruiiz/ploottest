import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const rawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

const parsedEnv = envSchema.safeParse(rawEnv);
const publicEnvSchema = envSchema.pick({
  NEXT_PUBLIC_SUPABASE_URL: true,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
});
const parsedPublicEnv = publicEnvSchema.safeParse(rawEnv);

export const envStatus = {
  NEXT_PUBLIC_SUPABASE_URL: Boolean(rawEnv.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(rawEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  SUPABASE_SERVICE_ROLE_KEY: Boolean(rawEnv.SUPABASE_SERVICE_ROLE_KEY),
};

export function getRequiredEnv() {
  if (!parsedEnv.success) {
    throw new Error(
      `Missing required environment variables: ${parsedEnv.error.issues.map((issue) => issue.path.join(".")).join(", ")}`,
    );
  }

  return parsedEnv.data;
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
