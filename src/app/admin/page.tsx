import Link from "next/link";
import {
  Package,
  FolderOpen,
  MessageSquare,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { getDashboardStats, getRecentEnquiries } from "@/lib/queries";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const recentEnquiries = await getRecentEnquiries(5);

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      href: "/admin/products",
      color: "bg-terracotta-100 text-terracotta-700",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      href: "/admin/categories",
      color: "bg-amber-100 text-amber-700",
    },
    {
      label: "Unread Enquiries",
      value: stats.unreadEnquiries,
      icon: MessageSquare,
      href: "/admin/enquiries",
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold text-earth-900">
        Dashboard
      </h1>

      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="card flex items-center gap-4 p-6 transition-shadow hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-earth-900">
                  {stat.value}
                </p>
                <p className="text-sm text-earth-500">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card">
        <div className="flex items-center justify-between border-b border-cream-200 p-6">
          <h2 className="font-serif text-xl font-semibold text-earth-900">
            Recent Enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="flex items-center gap-1 text-sm font-medium text-terracotta-600 hover:text-terracotta-700"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recentEnquiries.length === 0 ? (
          <p className="p-6 text-earth-500">No enquiries yet.</p>
        ) : (
          <div className="divide-y divide-cream-200">
            {recentEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex items-start justify-between p-6"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-earth-900">{enquiry.name}</p>
                    {!enquiry.is_read && (
                      <span className="rounded-full bg-terracotta-100 px-2 py-0.5 text-xs font-medium text-terracotta-700">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-earth-500">{enquiry.email}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-earth-600">
                    {enquiry.message}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-earth-400">
                  {new Date(enquiry.created_at).toLocaleDateString("en-IN")}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
