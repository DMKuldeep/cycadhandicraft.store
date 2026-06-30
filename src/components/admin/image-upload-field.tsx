"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadProductImage } from "@/lib/actions";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProductImage(formData);
    if (result.url) onChange(result.url);
    if (result.error) setError(result.error);
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-earth-700">
        {label}
      </label>
      {hint && <p className="mb-2 text-xs text-earth-500">{hint}</p>}
      {error && (
        <p className="mb-2 text-sm text-red-600">{error}</p>
      )}
      <div className="flex flex-wrap items-start gap-4">
        {value && (
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-cream-200">
            <Image src={value} alt="" fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded bg-white/90 p-0.5 text-red-600"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-earth-200 px-6 py-4 hover:border-terracotta-400">
          <Upload className="mb-1 h-5 w-5 text-earth-400" />
          <span className="text-xs text-earth-600">
            {uploading ? "Uploading…" : "Upload image"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className="input-field mt-2 text-sm"
      />
    </div>
  );
}
