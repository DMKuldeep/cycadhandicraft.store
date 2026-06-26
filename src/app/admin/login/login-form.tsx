"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock } from "lucide-react";
import { adminLogin } from "@/lib/actions";
import { SITE_NAME } from "@/lib/constants";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "unauthorized"
      ? "You are not authorized as an admin"
      : null
  );
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await adminLogin(data.email, data.password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-earth-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-600">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-cream-50">
            {SITE_NAME}
          </h1>
          <p className="text-cream-400">Admin Panel Login</p>
        </div>

        <div className="rounded-xl bg-earth-800 p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-900/50 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-cream-300">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full rounded-lg border border-earth-700 bg-earth-900 px-4 py-2.5 text-cream-50 placeholder:text-earth-500 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-cream-300">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="w-full rounded-lg border border-earth-700 bg-earth-900 px-4 py-2.5 text-cream-50 placeholder:text-earth-500 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-terracotta-700 disabled:opacity-50"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
