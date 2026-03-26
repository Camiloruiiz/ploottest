"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/db/supabase-browser";
import { parseAuthFragment } from "@/modules/auth/hash";

export function AuthHashHandler() {
  useEffect(() => {
    const session = parseAuthFragment(window.location.hash, window.location.search);

    if (!session) {
      return;
    }

    const supabase = createBrowserSupabaseClient();

    void supabase.auth
      .setSession({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
      })
      .then(({ error }) => {
        if (error) {
          console.error("Unable to restore Supabase session from hash fragment.", error);
          return;
        }

        window.location.replace(session.next);
      });
  }, []);

  return null;
}
