"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle } from "lucide-react";
import { submitEnquiry } from "@/lib/actions";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setError(null);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("message", data.message);

    startTransition(async () => {
      const result = await submitEnquiry(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
        reset();
      }
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-terracotta-50 p-8 text-center">
        <CheckCircle className="mb-4 h-12 w-12 text-terracotta-600" />
        <h3 className="mb-2 font-serif text-xl font-semibold text-earth-900">
          Thank You!
        </h3>
        <p className="text-earth-600">
          We&apos;ve received your message and will get back to you soon.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-ghost mt-4 text-terracotta-600"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-earth-700">
          Your Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="input-field"
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-earth-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="input-field"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-earth-700">
          Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          rows={4}
          className="input-field resize-none"
          placeholder="Tell us about your enquiry..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full">
        <Send className="h-4 w-4" />
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
