"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/modules/auth/session";

export function StoreHeader({
  user,
  cartCount,
}: {
  user: SessionUser | null;
  cartCount: number;
}) {
  const router = useRouter();
  const [demoEmail, setDemoEmail] = useState<string | null>(null);

  useEffect(() => {
    setDemoEmail(window.localStorage.getItem("ploottest_demo_user"));
  }, []);

  const effectiveEmail = user?.email ?? demoEmail;

  async function handleLogout() {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    window.localStorage.removeItem("ploottest_demo_user");
    router.refresh();
  }

  return (
    <header className="shell">
      <div className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">PT</span>
          <strong>PlootTest</strong>
        </Link>

        <nav className="topnav">
          <Link href="/">Catalog</Link>
          <Link href="/cart">Cart ({cartCount})</Link>
          {effectiveEmail ? <Link href="/orders">Orders</Link> : null}
          {effectiveEmail ? (
            <div className="user-chip">
              <span>{effectiveEmail}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/auth?next=/cart">Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
