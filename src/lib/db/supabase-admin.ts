import { createClient } from "@supabase/supabase-js";
import { getAdminEnv } from "@/lib/config/env";

export function createAdminClient() {
  const env = getAdminEnv();

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
