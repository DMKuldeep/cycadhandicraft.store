import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getProductByIdAdmin } from "@/lib/queries";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductByIdAdmin(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold text-earth-900">
        Edit Product
      </h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
