"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, X, Plus } from "lucide-react";
import type { Product, Category } from "@/types/database";
import {
  createProduct,
  updateProduct,
  createCategory,
  uploadProductImage,
} from "@/lib/actions";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories: initialCategories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState(initialCategories);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.image_urls ?? []);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadProductImage(formData);
      if (result.url) {
        setImageUrls((prev) => [...prev, result.url!]);
      }
    }
    setUploading(false);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const formData = new FormData();
    formData.append("name", newCategoryName);
    const result = await createCategory(formData);
    if (result.success) {
      setCategories((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: newCategoryName,
          slug: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
          image_url: null,
          created_at: new Date().toISOString(),
        },
      ]);
      setNewCategoryName("");
      setShowNewCategory(false);
      router.refresh();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("imageUrls", JSON.stringify(imageUrls));
    formData.set("isActive", (e.currentTarget.elements.namedItem("isActive") as HTMLInputElement).checked ? "true" : "false");

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl p-6">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Product Name *
          </label>
          <input
            name="name"
            defaultValue={product?.name}
            required
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            rows={4}
            className="input-field resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Price (INR) *
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="1"
              defaultValue={product?.price ?? ""}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Stock *
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={product?.stock ?? 0}
              required
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Category
          </label>
          <div className="flex gap-2">
            <select
              name="categoryId"
              defaultValue={product?.category_id ?? ""}
              className="input-field flex-1"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategory(!showNewCategory)}
              className="btn-ghost border border-earth-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {showNewCategory && (
            <div className="mt-2 flex gap-2">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="btn-primary !px-4"
              >
                Add
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-earth-700">
            Images
          </label>
          <div className="mb-3 flex flex-wrap gap-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg">
                <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute right-0.5 top-0.5 rounded-full bg-red-600 p-0.5 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <label className="btn-secondary cursor-pointer">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Images"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            defaultChecked={product?.is_active ?? true}
            className="h-4 w-4 rounded border-earth-300 text-terracotta-600 focus:ring-terracotta-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-earth-700">
            Active (visible in shop)
          </label>
        </div>

        <div className="flex gap-3 border-t border-cream-200 pt-6">
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? "Saving..." : product ? "Update Product" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
