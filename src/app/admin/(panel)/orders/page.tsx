import { OrderList } from "@/components/admin/order-list";
import { getOrders } from "@/lib/queries";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold text-earth-900">
        Orders
      </h1>
      <OrderList orders={orders} />
    </div>
  );
}
