"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

  async function handleLogout() {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <header className="shell">
      <div className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">PT</span>
          <div>
            <strong>PlootTest</strong>
            <p>Field-ready essentials for the MVP store.</p>
          </div>
        </Link>

        <nav className="topnav">
          <Link href="/">Catalog</Link>
          <Link href="/cart">Cart ({cartCount})</Link>
          {user ? <Link href="/orders">Orders</Link> : null}
          {user ? (
            <div className="user-chip">
              <span>{user.email}</span>
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
