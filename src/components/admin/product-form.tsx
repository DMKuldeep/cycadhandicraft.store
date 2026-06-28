"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { Product, Category } from "@/types/database";
import {
  createProduct,
  updateProduct,
  createCategory,
} from "@/lib/actions";
import { ProductMediaManager } from "./product-media-manager";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories: initialCategories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState(initialCategories);
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.image_urls?.slice(0, 6) ?? []
  );
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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
    formData.set(
      "isActive",
      (e.currentTarget.elements.namedItem("isActive") as HTMLInputElement)
        .checked
        ? "true"
        : "false"
    );

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
    <form onSubmit={handleSubmit} className="card max-w-3xl p-6">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <ProductMediaManager imageUrls={imageUrls} onChange={setImageUrls} />

        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Product Name *
          </label>
          <input
            name="name"
            defaultValue={product?.name}
            required
            className="input-field"
            placeholder="e.g. Brass Tealight Diya Set"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Description *
          </label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            rows={8}
            required
            className="input-field resize-y"
            placeholder="Full product description — shown on product page with Read more / Read less…"
          />
          <p className="mt-1 text-xs text-earth-500">
            Write a detailed description. Long text collapses on the product
            page with a Read more toggle.
          </p>
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
