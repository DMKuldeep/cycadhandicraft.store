"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { customerRegister } from "@/lib/actions";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await customerRegister(
        data.email,
        data.password,
        data.name
      );
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  if (success) {
    return (
      <section className="section-padding">
        <div className="container-narrow max-w-md text-center">
          <div className="card p-8">
            <h1 className="mb-4 font-serif text-2xl font-bold text-earth-900">
              Check Your Email
            </h1>
            <p className="mb-6 text-earth-600">
              We&apos;ve sent you a confirmation link. Please check your email to
              verify your account.
            </p>
            <Link href="/login" className="btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-narrow max-w-md">
        <div className="card p-8">
          <h1 className="mb-2 text-center font-serif text-3xl font-bold text-earth-900">
            Create Account
          </h1>
          <p className="mb-8 text-center text-earth-600">
            Join Cycad Handicrafts
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-earth-700">
                Full Name
              </label>
              <input
                {...register("name")}
                className="input-field"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-earth-700">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-earth-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-earth-700">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-earth-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-terracotta-600 hover:text-terracotta-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
