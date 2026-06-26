"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import type { Product } from "@/types/database";
import { formatPrice, getProductImage } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const images =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : [getProductImage(null)];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      imageUrl: images[0],
      stock: product.stock,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <Link
        href="/shop"
        className="mb-6 inline-flex items-center gap-2 text-sm text-earth-600 transition-colors hover:text-terracotta-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-cream-100">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === i
                      ? "border-terracotta-600"
                      : "border-transparent hover:border-cream-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.categories && (
            <Link
              href={`/shop?category=${product.categories.slug}`}
              className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-terracotta-600 hover:text-terracotta-700"
            >
              {product.categories.name}
            </Link>
          )}
          <h1 className="mb-4 font-serif text-3xl font-bold text-earth-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mb-6 text-3xl font-bold text-terracotta-600">
            {formatPrice(Number(product.price))}
          </p>

          {product.description && (
            <div className="mb-8 leading-relaxed text-earth-600">
              <p>{product.description}</p>
            </div>
          )}

          <div className="mb-6 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                product.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-earth-700">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-earth-200 text-earth-600 transition-colors hover:bg-cream-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-earth-200 text-earth-600 transition-colors hover:bg-cream-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary w-full sm:w-auto"
          >
            {added ? (
              <>
                <Check className="h-5 w-5" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
