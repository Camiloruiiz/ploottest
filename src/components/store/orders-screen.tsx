"use client";

import { useQuery } from "@tanstack/react-query";
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

export function OrdersScreen({ user }: { user: SessionUser }) {
  const { itemCount } = useCart();
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/v1/orders");
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
            <div>
              <p className="eyebrow">Orders Feature</p>
              <h1>Your order history</h1>
            </div>
          </div>

          {ordersQuery.isLoading ? <p>Loading orders...</p> : null}
          {ordersQuery.isError ? <p>Orders are currently unavailable.</p> : null}
          {!ordersQuery.isLoading && !ordersQuery.data?.length ? <p>No orders yet.</p> : null}

          <div className="order-list">
            {ordersQuery.data?.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle>{order.status}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="summary-row">
                    <span>Created</span>
                    <strong>{formatDate(order.created_at)}</strong>
                  </div>
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
