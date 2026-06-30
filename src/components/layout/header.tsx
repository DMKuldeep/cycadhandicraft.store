"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-cream-200 bg-cream-50/95 backdrop-blur-sm">
      <div className="container-narrow flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 flex-col">
          <span className="truncate font-serif text-xl font-bold text-terracotta-700 transition-colors group-hover:text-terracotta-600 sm:text-2xl">
            {SITE_NAME}
          </span>
          <span className="hidden text-xs text-earth-500 sm:block">
            Handcrafted with Love
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-earth-700 transition-colors hover:text-terracotta-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg p-2 text-earth-600 transition-colors hover:bg-cream-200 hover:text-terracotta-600 sm:block"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-earth-600 transition-colors hover:bg-cream-200 hover:text-terracotta-600"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta-600 text-xs font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <button
            className="rounded-lg p-2 text-earth-600 transition-colors hover:bg-cream-200 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-cream-200 bg-cream-50 md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="container-narrow flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-3 text-sm font-medium text-earth-700 transition-colors hover:bg-cream-200 hover:text-terracotta-600"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg px-4 py-3 text-sm font-medium text-earth-700 transition-colors hover:bg-cream-200 hover:text-terracotta-600"
            onClick={() => setMobileOpen(false)}
          >
            Account
          </Link>
        </nav>
      </div>
    </header>
  );
}
