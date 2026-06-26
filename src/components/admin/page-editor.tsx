"use client";

import { useState, useTransition } from "react";
import type { PageContent } from "@/types/database";
import { updatePageContent } from "@/lib/actions";
import { useRouter } from "next/navigation";

const PAGE_SLUGS = [
  { slug: "about", label: "About Us" },
  { slug: "faq", label: "FAQ" },
  { slug: "terms", label: "Terms & Conditions" },
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "returns", label: "Returns & Refunds" },
];

interface PageEditorProps {
  pages: PageContent[];
}

export function PageEditor({ pages }: PageEditorProps) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(PAGE_SLUGS[0].slug);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const currentPage = pages.find((p) => p.slug === selectedSlug);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    startTransition(async () => {
      const result = await updatePageContent(selectedSlug, title, content);
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Page saved successfully!");
        router.refresh();
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="card p-4">
        <h3 className="mb-3 text-sm font-semibold text-earth-700">Pages</h3>
        <ul className="space-y-1">
          {PAGE_SLUGS.map((page) => (
            <li key={page.slug}>
              <button
                onClick={() => {
                  setSelectedSlug(page.slug);
                  setMessage(null);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedSlug === page.slug
                    ? "bg-terracotta-100 font-medium text-terracotta-700"
                    : "text-earth-600 hover:bg-cream-100"
                }`}
              >
                {page.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6 lg:col-span-3">
        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.includes("success")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Page Title
          </label>
          <input
            name="title"
            key={`title-${selectedSlug}`}
            defaultValue={currentPage?.title ?? PAGE_SLUGS.find((p) => p.slug === selectedSlug)?.label}
            required
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Content (HTML supported)
          </label>
          <textarea
            name="content"
            key={`content-${selectedSlug}`}
            defaultValue={currentPage?.content ?? ""}
            rows={16}
            required
            className="input-field resize-y font-mono text-sm"
          />
        </div>

        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? "Saving..." : "Save Page"}
        </button>
      </form>
    </div>
  );
}
