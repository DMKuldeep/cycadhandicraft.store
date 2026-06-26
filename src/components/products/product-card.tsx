"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice, getProductImage } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const imageUrl = getProductImage(product.image_urls);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      imageUrl,
      stock: product.stock,
    });
  };

  return (
    <div className="group card overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
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
          <h3 className="mb-2 font-serif text-lg font-semibold text-earth-900 line-clamp-2 group-hover:text-terracotta-700">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-terracotta-600">
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
