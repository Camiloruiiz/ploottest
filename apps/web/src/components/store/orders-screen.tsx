"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/store/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { useCart } from "@/components/providers/cart-provider";
import type { SessionUser } from "@/modules/auth/session";

type OrdersResponse = {
  ok: boolean;
  data: {
    items: Array<{
      id: string;
      status: string;
      total_cents: number;
      created_at: string;
      items: Array<{
        id: string;
        quantity: number;
        unit_price_cents: number;
        subtotal_cents: number;
        product_name: string;
      }>;
    }>;
  };
};

export function OrdersScreen({ user }: { user: SessionUser | null }) {
  const { itemCount } = useCart();
  const [demoEmail, setDemoEmail] = useState<string | null>(null);

  useEffect(() => {
    setDemoEmail(window.localStorage.getItem("ploottest_demo_user"));
  }, []);

  const effectiveEmail = user?.email ?? demoEmail;
  const ordersQuery = useQuery({
    queryKey: ["orders", effectiveEmail],
    enabled: Boolean(effectiveEmail),
    queryFn: async () => {
      const response = await fetch("/api/v1/orders", {
        headers: effectiveEmail ? { "x-demo-user": effectiveEmail } : {},
      });
      const payload = (await response.json()) as OrdersResponse;

      if (!response.ok || !payload.ok) {
        throw new Error("Unable to load orders.");
      }

      return payload.data.items;
    },
  });

  return (
    <>
      <StoreHeader user={user} cartCount={itemCount} />
      <main className="shell">
        <section className="catalog-shell">
          <div className="section-heading">
            <h1>Your order history</h1>
          </div>

          {ordersQuery.isLoading ? <div className="status-block">Loading orders...</div> : null}
          {ordersQuery.isError ? <div className="status-block">Orders are currently unavailable.</div> : null}
          {!effectiveEmail ? <div className="status-block">Sign in to review your orders.</div> : null}
          {!ordersQuery.isLoading && effectiveEmail && !ordersQuery.data?.length ? (
            <div className="status-block">No orders yet.</div>
          ) : null}

          <div className="order-list">
            {ordersQuery.data?.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="order-card-heading">
                    <CardTitle>{order.status}</CardTitle>
                    <div className="orbit-tag">{formatDate(order.created_at)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="summary-row">
                    <span>Total</span>
                    <strong>{formatCurrency(order.total_cents)}</strong>
                  </div>
                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="summary-row">
                        <span>
                          {item.product_name} x {item.quantity}
                        </span>
                        <strong>{formatCurrency(item.subtotal_cents)}</strong>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
