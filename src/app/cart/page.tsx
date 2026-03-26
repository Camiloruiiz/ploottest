import { CartScreen } from "@/components/store/cart-screen";
import { getCurrentUser } from "@/modules/auth/session";

export default async function CartPage() {
  const user = await getCurrentUser();

  return <CartScreen user={user} />;
}
