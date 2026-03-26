import products from "../src/lib/data/products.seed.json";
import { createAdminClient } from "../src/lib/db/supabase-admin";
import { productSeedSchema } from "../src/lib/validation/products";

async function main() {
  const admin = createAdminClient();
  const payload = productSeedSchema.array().parse(products);

  const { error } = await admin.from("products").upsert(payload, {
    onConflict: "id",
  });

  if (error) {
    throw error;
  }

  console.log(`Seeded ${payload.length} products.`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
