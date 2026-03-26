import { Storefront } from "@/components/store/storefront";
import { getCurrentUser } from "@/modules/auth/session";
import { parseProductQuery } from "@/modules/products/query";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseProductQuery(await searchParams);
  const user = await getCurrentUser();

  return <Storefront user={user} initialQuery={params} />;
}
