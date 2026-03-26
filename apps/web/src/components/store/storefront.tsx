"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/providers/cart-provider";
import { StoreHeader } from "@/components/store/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { buildProductQueryString } from "@/modules/products/query";
import type { SessionUser } from "@/modules/auth/session";
import type { ProductRecord } from "@/modules/products/service";

type ProductsResponse = {
  ok: boolean;
  data: {
    items: ProductRecord[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
};

export function Storefront({
  user,
  initialQuery,
}: {
  user: SessionUser | null;
  initialQuery: {
    q: string;
    page: number;
    pageSize: number;
    inStock: "all" | "true" | "false";
    sort: "newest" | "price_asc" | "price_desc" | "name_asc";
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const deferredSearch = useDeferredValue(initialQuery.q);
  const [search, setSearch] = useState(initialQuery.q);
  const [inStock, setInStock] = useState(initialQuery.inStock);
  const [sort, setSort] = useState(initialQuery.sort);
  const { addItem, itemCount, totalCents } = useCart();

  useEffect(() => {
    setSearch(initialQuery.q);
    setInStock(initialQuery.inStock);
    setSort(initialQuery.sort);
  }, [initialQuery.inStock, initialQuery.q, initialQuery.sort]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const queryString = buildProductQueryString({
        q: search.trim(),
        inStock,
        sort,
        page: 1,
        pageSize: initialQuery.pageSize,
      });
      router.replace((queryString ? `${pathname}?${queryString}` : pathname) as never, { scroll: false });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [deferredSearch, inStock, sort, search, router, pathname, initialQuery.pageSize]);

  const queryString = searchParams.toString();

  const productsQuery = useQuery({
    queryKey: ["products", queryString],
    queryFn: async (): Promise<ProductsResponse["data"]> => {
      const response = await fetch(`/api/v1/products${queryString ? `?${queryString}` : ""}`);
      const payload = (await response.json()) as ProductsResponse;
      if (!response.ok || !payload.ok) {
        throw new Error("Unable to load products.");
      }
      return payload.data;
    },
  });

  const products = productsQuery.data?.items ?? [];
  const meta = productsQuery.data?.meta;

  function goToPage(page: number) {
    const next = buildProductQueryString({
      q: search.trim(),
      inStock,
      sort,
      page,
      pageSize: initialQuery.pageSize,
    });
    router.replace(`${pathname}?${next}` as never, { scroll: true });
  }

  return (
    <>
      <StoreHeader user={user} cartCount={itemCount} />
      <main className="shell">
        <section className="hero">
          <Card className="hero-panel">
            <CardHeader>
              <div className="orbit-tag">Dreamlike catalog</div>
              <CardTitle>Collect what you want. Drift past the rest.</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="lede">
                Search fast, sort quietly, and move straight from discovery to checkout.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="catalog-shell">
          <Card>
            <CardHeader>
              <CardTitle>Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="controls-grid">
                <Input
                  aria-label="Search products"
                  placeholder="Search by product name"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <label className="control-field">
                  <span>Availability</span>
                  <select value={inStock} onChange={(event) => setInStock(event.target.value as typeof inStock)}>
                    <option value="all">All stock states</option>
                    <option value="true">In stock only</option>
                    <option value="false">Sold out only</option>
                  </select>
                </label>
                <label className="control-field">
                  <span>Sort</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                    <option value="newest">Newest first</option>
                    <option value="price_asc">Price low to high</option>
                    <option value="price_desc">Price high to low</option>
                    <option value="name_asc">Name A-Z</option>
                  </select>
                </label>
              </div>
            </CardContent>
          </Card>

          {productsQuery.isLoading ? <div className="status-block">Loading catalog...</div> : null}
          {productsQuery.isError ? <div className="status-block">Catalog is currently unavailable.</div> : null}

          <div className="product-grid">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="orbit-tag">{product.stock > 0 ? "In stock" : "Sold out"}</div>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="product-description">{product.description}</p>
                  <div className="product-meta">
                    <strong>{formatCurrency(product.price_cents)}</strong>
                    <span>{product.stock} units left</span>
                  </div>
                  <Button
                    style={{ width: "100%", marginTop: 18 }}
                    disabled={product.stock === 0}
                    aria-label={`Add ${product.name} to cart`}
                    data-testid={`add-to-cart-${product.id}`}
                    onClick={() =>
                      addItem({
                        product_id: product.id,
                        name: product.name,
                        unit_price_cents: product.price_cents,
                        stock: product.stock,
                      })
                    }
                  >
                    Add to cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {!productsQuery.isLoading && !products.length ? (
            <Card>
              <CardContent>
                <p className="minimal-copy">No products matched the current filters.</p>
              </CardContent>
            </Card>
          ) : null}

          {meta ? (
            <div className="pagination-row">
              <Button variant="outline" disabled={meta.page <= 1} onClick={() => goToPage(meta.page - 1)}>
                Previous
              </Button>
              <span>
                Page {meta.page} of {meta.totalPages} · {meta.total} items
              </span>
              <Button variant="outline" disabled={meta.page >= meta.totalPages} onClick={() => goToPage(meta.page + 1)}>
                Next
              </Button>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
