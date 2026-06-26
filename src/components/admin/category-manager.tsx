"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Pencil } from "lucide-react";
import type { Category } from "@/types/database";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories: initial }: CategoryManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result.success) {
        setShowAdd(false);
        router.refresh();
      }
    });
  };

  const handleUpdate = (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateCategory(id, formData);
      if (result.success) {
        setEditingId(null);
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this category? Products will be uncategorized.")) return;
    startTransition(async () => {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
        {showAdd ? "Cancel" : "Add Category"}
      </button>

      {showAdd && (
        <form onSubmit={handleCreate} className="card max-w-md space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Name *
            </label>
            <input name="name" required className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Image URL (optional)
            </label>
            <input name="imageUrl" className="input-field" placeholder="https://..." />
          </div>
          <button type="submit" disabled={isPending} className="btn-primary">
            Create Category
          </button>
        </form>
      )}

      <div className="card divide-y divide-cream-200">
        {categories.length === 0 ? (
          <p className="p-6 text-earth-500">No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 p-4">
              {cat.image_url && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              )}
              {editingId === cat.id ? (
                <form
                  onSubmit={(e) => handleUpdate(cat.id, e)}
                  className="flex flex-1 flex-wrap items-end gap-3"
                >
                  <input
                    name="name"
                    defaultValue={cat.name}
                    required
                    className="input-field flex-1"
                  />
                  <input
                    name="imageUrl"
                    defaultValue={cat.image_url ?? ""}
                    className="input-field flex-1"
                    placeholder="Image URL"
                  />
                  <button type="submit" disabled={isPending} className="btn-primary !py-2">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="btn-ghost !py-2"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium text-earth-900">{cat.name}</p>
                    <p className="text-sm text-earth-500">{cat.slug}</p>
                  </div>
                  <button
                    onClick={() => setEditingId(cat.id)}
                    className="rounded-lg p-2 text-earth-500 hover:bg-cream-200 hover:text-terracotta-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={isPending}
                    className="rounded-lg p-2 text-earth-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
