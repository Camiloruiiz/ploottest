"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { StoreHeader } from "@/components/store/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { SessionUser } from "@/modules/auth/session";

export function CartScreen({ user }: { user: SessionUser | null }) {
  const { state, itemCount, totalCents, removeItem, setQuantity, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [demoEmail, setDemoEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setDemoEmail(window.localStorage.getItem("ploottest_demo_user"));
  }, []);

  const effectiveEmail = user?.email ?? demoEmail;

  async function checkout() {
    setSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(effectiveEmail ? { "x-demo-user": effectiveEmail } : {}),
      },
      body: JSON.stringify({
        items: state.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error?.message ?? "Checkout failed.");
      setSubmitting(false);
      return;
    }

    clear();
    router.push(`/orders?created=${payload.data.id}`);
    router.refresh();
  }

  return (
    <>
      <StoreHeader user={user} cartCount={itemCount} />
      <main className="shell">
        <section className="catalog-shell">
          <div className="section-heading">
            <h1>Your purchase draft</h1>
            <Button variant="outline" onClick={clear} disabled={!state.items.length}>
              Empty cart
            </Button>
          </div>

          <div className="cart-layout">
            <div className="cart-items">
              {state.items.length ? (
                state.items.map((item) => (
                  <Card key={item.product_id}>
                    <CardHeader>
                      <div className="cart-card-heading">
                        <CardTitle>{item.name}</CardTitle>
                        <div className="orbit-tag">{item.quantity} in orbit</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="cart-row">
                        <span>{formatCurrency(item.unit_price_cents)}</span>
                        <div className="quantity-row">
                          <Button variant="outline" onClick={() => setQuantity(item.product_id, item.quantity - 1)}>
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button variant="outline" onClick={() => setQuantity(item.product_id, item.quantity + 1)}>
                            +
                          </Button>
                        </div>
                        <strong>{formatCurrency(item.unit_price_cents * item.quantity)}</strong>
                      </div>
                      <Button variant="subtle" style={{ marginTop: 14 }} onClick={() => removeItem(item.product_id)}>
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent>
                    <p className="minimal-copy" style={{ marginBottom: 12 }}>
                      Your cart is empty.
                    </p>
                    <Button asChild>
                      <Link href="/">Back to catalog</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="summary-row">
                  <span>Items</span>
                  <strong>{itemCount}</strong>
                </div>
                <div className="summary-row">
                  <span>Total</span>
                  <strong>{formatCurrency(totalCents)}</strong>
                </div>
                {message ? <p className="error-text">{message}</p> : null}
                {effectiveEmail ? (
                  <Button style={{ width: "100%", marginTop: 18 }} disabled={!itemCount || submitting} onClick={checkout}>
                    {submitting ? "Aligning checkout..." : "Checkout"}
                  </Button>
                ) : (
                  <Button asChild style={{ width: "100%", marginTop: 18 }}>
                    <Link href="/auth?next=/cart">Sign in</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
