"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  ChevronUp,
  ChevronDown,
  GripVertical,
  ImageIcon,
} from "lucide-react";
import { uploadProductImage } from "@/lib/actions";
import { MAX_PRODUCT_IMAGES } from "@/lib/constants";

interface ProductMediaManagerProps {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
}

export function ProductMediaManager({
  imageUrls,
  onChange,
}: ProductMediaManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_PRODUCT_IMAGES - imageUrls.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_PRODUCT_IMAGES} images allowed`);
      return;
    }

    setError(null);
    setUploading(true);

    const toUpload = Array.from(files).slice(0, remaining);
    const newUrls: string[] = [];

    for (const file of toUpload) {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadProductImage(formData);
      if (result.url) newUrls.push(result.url);
      if (result.error) setError(result.error);
    }

    onChange([...imageUrls, ...newUrls]);
    setUploading(false);
    e.target.value = "";
  };

  const remove = (index: number) => {
    onChange(imageUrls.filter((_, i) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= imageUrls.length) return;
    const updated = [...imageUrls];
    [updated[index], updated[next]] = [updated[next], updated[index]];
    onChange(updated);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-earth-700">
          Product Images
        </label>
        <span className="text-xs text-earth-500">
          {imageUrls.length}/{MAX_PRODUCT_IMAGES} · First image is the cover
        </span>
      </div>

      {error && (
        <div className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {imageUrls.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="group relative overflow-hidden rounded-xl border border-cream-200 bg-cream-50"
          >
            <div className="relative aspect-square">
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="160px"
              />
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-terracotta-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Cover
                </span>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-cream-200 bg-white px-2 py-1.5">
              <GripVertical className="h-4 w-4 text-earth-300" />
              <div className="flex gap-0.5">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded p-1 text-earth-500 hover:bg-cream-100 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === imageUrls.length - 1}
                  className="rounded p-1 text-earth-500 hover:bg-cream-100 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {imageUrls.length < MAX_PRODUCT_IMAGES && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-earth-200 bg-cream-50 transition-colors hover:border-terracotta-400 hover:bg-terracotta-50/50">
            {uploading ? (
              <span className="text-xs text-earth-500">Uploading…</span>
            ) : (
              <>
                <Upload className="mb-2 h-6 w-6 text-earth-400" />
                <span className="text-xs font-medium text-earth-600">
                  Add image
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {imageUrls.length === 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-cream-100 p-4 text-sm text-earth-600">
          <ImageIcon className="h-5 w-5 shrink-0 text-terracotta-500" />
          Upload up to {MAX_PRODUCT_IMAGES} images. Customers can zoom on hover
          and view full-screen on the product page.
        </div>
      )}
    </div>
  );
}
