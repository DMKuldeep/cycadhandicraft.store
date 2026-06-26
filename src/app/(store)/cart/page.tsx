"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CheckCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(10, "Please enter your full address"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart, itemCount } =
    useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onCheckout = (data: CheckoutForm) => {
    setError(null);
    startTransition(async () => {
      const result = await createOrder({
        ...data,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      });

      if (result.error) {
        setError(result.error);
      } else {
        setOrderId(result.orderId ?? null);
        setOrderPlaced(true);
        clearCart();
      }
    });
  };

  if (orderPlaced) {
    return (
      <section className="section-padding">
        <div className="container-narrow max-w-lg text-center">
          <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-600" />
          <h1 className="mb-4 font-serif text-3xl font-bold text-earth-900">
            Order Placed Successfully!
          </h1>
          <p className="mb-2 text-earth-600">
            Thank you for your order. We&apos;ll contact you shortly to confirm
            payment and shipping details.
          </p>
          {orderId && (
            <p className="mb-6 text-sm text-earth-500">
              Order ID: <span className="font-mono">{orderId.slice(0, 8)}</span>
            </p>
          )}
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  if (itemCount === 0) {
    return (
      <section className="section-padding">
        <div className="container-narrow text-center">
          <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-earth-300" />
          <h1 className="mb-4 font-serif text-3xl font-bold text-earth-900">
            Your Cart is Empty
          </h1>
          <p className="mb-8 text-earth-600">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/shop" className="btn-primary">
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <h1 className="mb-8 font-serif text-3xl font-bold text-earth-900">
          Shopping Cart
        </h1>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="card flex gap-4 p-4">
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-cream-100"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-serif text-lg font-semibold text-earth-900 hover:text-terracotta-600"
                      >
                        {item.name}
                      </Link>
                      <p className="text-terracotta-600 font-semibold">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded border border-earth-200 text-earth-600 hover:bg-cream-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded border border-earth-200 text-earth-600 hover:bg-cream-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-earth-400 transition-colors hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="font-semibold text-earth-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="card sticky top-24 p-6">
              {!showCheckout ? (
                <>
                  <h2 className="mb-4 font-serif text-xl font-semibold text-earth-900">
                    Order Summary
                  </h2>
                  <div className="mb-4 space-y-2 border-b border-cream-200 pb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-600">
                        Subtotal ({itemCount} items)
                      </span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-600">Shipping</span>
                      <span className="font-medium text-green-600">
                        Calculated at checkout
                      </span>
                    </div>
                  </div>
                  <div className="mb-6 flex justify-between">
                    <span className="text-lg font-semibold text-earth-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-terracotta-600">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="btn-primary w-full"
                  >
                    Proceed to Checkout
                  </button>
                </>
              ) : (
                <>
                  <h2 className="mb-4 font-serif text-xl font-semibold text-earth-900">
                    Checkout Details
                  </h2>
                  {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <form
                    onSubmit={handleSubmit(onCheckout)}
                    className="space-y-4"
                  >
                    <div>
                      <label className="mb-1 block text-sm font-medium text-earth-700">
                        Full Name
                      </label>
                      <input
                        {...register("customerName")}
                        className="input-field"
                        placeholder="Your name"
                      />
                      {errors.customerName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.customerName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-earth-700">
                        Email
                      </label>
                      <input
                        {...register("customerEmail")}
                        type="email"
                        className="input-field"
                        placeholder="you@example.com"
                      />
                      {errors.customerEmail && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.customerEmail.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-earth-700">
                        Phone (optional)
                      </label>
                      <input
                        {...register("customerPhone")}
                        className="input-field"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-earth-700">
                        Shipping Address
                      </label>
                      <textarea
                        {...register("shippingAddress")}
                        rows={3}
                        className="input-field resize-none"
                        placeholder="Full address with pincode"
                      />
                      {errors.shippingAddress && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shippingAddress.message}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between border-t border-cream-200 pt-4">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-terracotta-600">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn-primary w-full"
                    >
                      {isPending ? "Placing Order..." : "Place Order"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="btn-ghost w-full"
                    >
                      Back to Cart
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
