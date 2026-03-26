import { AuthScreen } from "@/components/store/auth-screen";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const next = Array.isArray(resolved.next) ? resolved.next[0] : resolved.next;

  return <AuthScreen next={next ?? "/cart"} />;
}
