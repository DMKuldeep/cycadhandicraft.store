"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  MessageSquare,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { adminLogout } from "@/lib/actions";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  };

  const linkClass = (href: string) => {
    const isActive =
      href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    return cn(
      "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-terracotta-600 text-white"
        : "text-cream-300 hover:bg-earth-800 hover:text-cream-50"
    );
  };

  return (
    <>
      {/* Mobile: always-visible top navigation (no JS required) */}
      <header className="border-b border-earth-800 bg-earth-900 md:hidden">
        <div className="border-b border-earth-800 px-4 py-3">
          <Link href="/admin" className="block">
            <span className="font-serif text-lg font-bold text-cream-50">
              {SITE_NAME}
            </span>
            <span className="text-xs text-cream-400">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(item.href)}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex gap-2 border-t border-earth-800 px-4 py-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-xs text-cream-400 hover:text-cream-50"
          >
            View Store
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 text-xs text-cream-400 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Desktop: left sidebar */}
      <aside className="hidden w-64 shrink-0 bg-earth-900 md:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="border-b border-earth-800 p-6">
            <Link href="/admin" className="block">
              <span className="font-serif text-xl font-bold text-cream-50">
                {SITE_NAME}
              </span>
              <span className="block text-xs text-cream-400">Admin Panel</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    linkClass(item.href)
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-earth-800 p-4">
            <Link
              href="/"
              className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream-400 transition-colors hover:bg-earth-800 hover:text-cream-50"
            >
              View Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream-400 transition-colors hover:bg-earth-800 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
