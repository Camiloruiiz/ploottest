import { randomUUID, createHash } from "node:crypto";
import type { ProductRecord } from "@/modules/products/service";
import { fallbackProducts } from "@/modules/products/service";

export type DemoOrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price_cents: number;
  subtotal_cents: number;
};

export type DemoOrder = {
  id: string;
  user_id: string;
  user_email: string;
  status: string;
  total_cents: number;
  created_at: string;
  items: DemoOrderItem[];
};

type MagicLinkToken = {
  email: string;
  next: string;
  expires_at: number;
};

type DemoDb = {
  products: ProductRecord[];
  orders: DemoOrder[];
  magicLinks: Map<string, MagicLinkToken>;
};

declare global {
  var __ploottestDemoDb: DemoDb | undefined;
}

function createInitialProducts() {
  return fallbackProducts.map((product) => ({ ...product }));
}

function createDemoDb(): DemoDb {
  return {
    products: createInitialProducts(),
    orders: [],
    magicLinks: new Map(),
  };
}

export function getDemoDb() {
  if (!globalThis.__ploottestDemoDb) {
    globalThis.__ploottestDemoDb = createDemoDb();
  }

  return globalThis.__ploottestDemoDb;
}

export function resetDemoDb() {
  globalThis.__ploottestDemoDb = createDemoDb();
  return globalThis.__ploottestDemoDb;
}

export function deriveUserId(email: string) {
  const hex = createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export function createMagicLink(email: string, next: string) {
  const token = randomUUID();
  getDemoDb().magicLinks.set(token, {
    email,
    next,
    expires_at: Date.now() + 15 * 60_000,
  });
  return token;
}

export function consumeMagicLink(token: string) {
  const payload = getDemoDb().magicLinks.get(token);

  if (!payload) {
    return null;
  }

  getDemoDb().magicLinks.delete(token);

  if (payload.expires_at < Date.now()) {
    return null;
  }

  return payload;
}
