"use client";

import { useTransition } from "react";
import type { Order } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "@/lib/actions";
import { useRouter } from "next/navigation";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      await updateOrderStatus(id, status);
      router.refresh();
    });
  };

  if (orders.length === 0) {
    return (
      <div className="card p-8 text-center text-earth-500">No orders yet.</div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-cream-200 bg-cream-50">
            <tr>
              <th className="px-6 py-3 font-medium text-earth-600">Order ID</th>
              <th className="px-6 py-3 font-medium text-earth-600">Customer</th>
              <th className="px-6 py-3 font-medium text-earth-600">Total</th>
              <th className="px-6 py-3 font-medium text-earth-600">Status</th>
              <th className="px-6 py-3 font-medium text-earth-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-cream-50">
                <td className="px-6 py-4 font-mono text-xs text-earth-600">
                  {order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-earth-900">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-earth-500">
                    {order.customer_email}
                  </p>
                </td>
                <td className="px-6 py-4 font-medium text-earth-900">
                  {formatPrice(Number(order.total))}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    disabled={isPending}
                    className="input-field w-auto text-xs"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-earth-500">
                  {new Date(order.created_at).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
