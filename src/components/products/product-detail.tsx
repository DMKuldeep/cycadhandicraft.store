"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Truck,
  Shield,
  HandHeart,
  RotateCcw,
  ChevronRight,
  Zap,
} from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice, getProductImage } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { ProductGallery } from "./product-gallery";
import { ReadMoreText } from "@/components/ui/read-more-text";
import { ProductGrid } from "./product-grid";

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
}

const TRUST_BADGES = [
  { icon: HandHeart, label: "100% Handcrafted" },
  { icon: Shield, label: "Secure Checkout" },
  { icon: Truck, label: "Pan-India Delivery" },
  { icon: RotateCcw, label: "7-Day Returns" },
];

export function ProductDetail({
  product,
  relatedProducts = [],
}: ProductDetailProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const images =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls.slice(0, 6)
      : [getProductImage(null)];

  const addToCart = (redirectToCheckout = false) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      imageUrl: images[0],
      stock: product.stock,
      quantity,
    });

    if (redirectToCheckout) {
      router.push("/cart?checkout=1");
      return;
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const inStock = product.stock > 0;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-earth-500">
        <Link href="/" className="hover:text-terracotta-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-terracotta-600">
          Shop
        </Link>
        {product.categories && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href={`/shop?category=${product.categories.slug}`}
              className="hover:text-terracotta-600"
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="line-clamp-1 text-earth-800">{product.name}</span>
      </nav>

      {/* Main product section */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Gallery — 7 cols */}
        <div className="lg:col-span-7">
          <ProductGallery images={images} productName={product.name} />
        </div>

        {/* Purchase panel — sticky like Flipkart/Cred */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="card overflow-hidden">
              <div className="border-b border-cream-100 bg-cream-50/80 px-5 py-4">
                {product.categories && (
                  <Link
                    href={`/shop?category=${product.categories.slug}`}
                    className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700"
                  >
                    {product.categories.name}
                  </Link>
                )}
                <h1 className="font-serif text-2xl font-bold leading-snug text-earth-900 sm:text-3xl">
                  {product.name}
                </h1>
              </div>

              <div className="space-y-5 p-5">
                {/* Price block */}
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-bold text-earth-900">
                    {formatPrice(Number(product.price))}
                  </span>
                  <span className="mb-1 text-sm text-earth-500">
                    inclusive of all taxes
                  </span>
                </div>

                {/* Stock */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                      inStock
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    {inStock ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-2">
                  {TRUST_BADGES.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-xl bg-cream-50 px-3 py-2.5 text-xs font-medium text-earth-700"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-terracotta-500" />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Quantity */}
                {inStock && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-earth-800">
                      Quantity
                    </label>
                    <div className="inline-flex items-center rounded-xl border border-earth-200 bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex h-11 w-11 items-center justify-center text-earth-600 transition hover:bg-cream-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[3rem] text-center text-lg font-bold text-earth-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="flex h-11 w-11 items-center justify-center text-earth-600 transition hover:bg-cream-100"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* CTA buttons — Flipkart style dual actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => addToCart(false)}
                    disabled={!inStock}
                    className="btn-secondary flex-1 !py-3.5 disabled:opacity-50"
                  >
                    {added ? (
                      <>
                        <Check className="h-5 w-5" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(true)}
                    disabled={!inStock}
                    className="btn-buy flex-1 disabled:opacity-50"
                  >
                    <Zap className="h-5 w-5" />
                    Buy Now
                  </button>
                </div>

                <p className="text-center text-xs text-earth-500">
                  Payment via UPI / PayU — coming soon. Checkout collects your
                  order details today.
                </p>
              </div>
            </div>

            {/* Delivery card */}
            <div className="mt-4 card p-4">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-500" />
                <div>
                  <p className="text-sm font-semibold text-earth-900">
                    Delivery across India
                  </p>
                  <p className="text-xs text-earth-500">
                    Dispatched in 2–3 business days · 5–10 days delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description section */}
      {product.description && (
        <section className="mt-12 border-t border-cream-200 pt-10">
          <h2 className="mb-6 font-serif text-2xl font-bold text-earth-900">
            Product Details
          </h2>
          <div className="card p-6 sm:p-8">
            <ReadMoreText text={product.description} />
          </div>
        </section>
      )}

      {/* Highlights */}
      <section className="mt-10">
        <h2 className="mb-4 font-serif text-xl font-bold text-earth-900">
          Why You&apos;ll Love It
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            "Handcrafted by skilled artisans in Farrukhabad, UP",
            "Each piece is unique with natural variations",
            "Premium materials — brass, wood, marble & ceramic",
            "Perfect for gifting, festivals & home décor",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-xl bg-cream-100 px-4 py-3 text-sm text-earth-700"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-600" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-14 border-t border-cream-200 pt-10">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-earth-900">
              You May Also Like
            </h2>
            {product.categories && (
              <Link
                href={`/shop?category=${product.categories.slug}`}
                className="text-sm font-semibold text-terracotta-600 hover:text-terracotta-700"
              >
                View all
              </Link>
            )}
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
