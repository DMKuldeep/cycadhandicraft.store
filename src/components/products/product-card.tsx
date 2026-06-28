"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice, getProductImage } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const images =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls.slice(0, 6)
      : [getProductImage(null)];

  const displayImage = images[hovered && images.length > 1 ? 1 : activeImage];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      imageUrl: images[0],
      stock: product.stock,
    });
  };

  return (
    <div
      className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActiveImage(0);
      }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              hovered ? "scale-125" : "scale-100"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Image dots if multiple */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.slice(0, 4).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    (hovered ? i === 1 : i === activeImage)
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50"
                  )}
                />
              ))}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-earth-900/0 opacity-0 transition-all duration-300 group-hover:bg-earth-900/20 group-hover:opacity-100">
            <span className="flex translate-y-2 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-earth-800 shadow-lg transition-transform duration-300 group-hover:translate-y-0">
              <Eye className="h-3.5 w-3.5" />
              View Product
            </span>
          </div>

          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-earth-900/50">
              <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-earth-800">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          {product.categories && (
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-terracotta-500">
              {product.categories.name}
            </p>
          )}
          <h3 className="mb-2 font-serif text-lg font-semibold leading-snug text-earth-900 line-clamp-2 group-hover:text-terracotta-700">
            {product.name}
          </h3>
          <p className="text-xl font-bold text-earth-900">
            {formatPrice(Number(product.price))}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn-primary w-full !py-2.5 text-xs disabled:opacity-50"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
