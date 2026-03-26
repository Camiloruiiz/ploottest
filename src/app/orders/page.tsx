import { OrdersScreen } from "@/components/store/orders-screen";
import { getCurrentUser } from "@/modules/auth/session";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  return <OrdersScreen user={user} />;
}
