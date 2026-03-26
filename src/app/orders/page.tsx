import { OrdersScreen } from "@/components/store/orders-screen";
import { requireCurrentUser } from "@/modules/auth/session";

export default async function OrdersPage() {
  const user = await requireCurrentUser("/orders");

  return <OrdersScreen user={user} />;
}
