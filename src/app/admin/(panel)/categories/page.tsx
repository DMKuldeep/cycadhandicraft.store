import { CategoryManager } from "@/components/admin/category-manager";
import { getCategories } from "@/lib/queries";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold text-earth-900">
        Categories
      </h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
