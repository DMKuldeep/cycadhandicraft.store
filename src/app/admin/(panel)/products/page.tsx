import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { getAllProductsAdmin } from "@/lib/queries";
import { formatPrice, getProductImage } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-earth-900">
          Products
        </h1>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-200 bg-cream-50">
              <tr>
                <th className="px-6 py-3 font-medium text-earth-600">Image</th>
                <th className="px-6 py-3 font-medium text-earth-600">Name</th>
                <th className="px-6 py-3 font-medium text-earth-600">
                  Category
                </th>
                <th className="px-6 py-3 font-medium text-earth-600">Price</th>
                <th className="px-6 py-3 font-medium text-earth-600">Stock</th>
                <th className="px-6 py-3 font-medium text-earth-600">
                  Status
                </th>
                <th className="px-6 py-3 font-medium text-earth-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-earth-500">
                    No products yet. Add your first product.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-50">
                    <td className="px-6 py-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                        <Image
                          src={getProductImage(product.image_urls)}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-earth-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-earth-600">
                      {product.categories?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-earth-900">
                      {formatPrice(Number(product.price))}
                    </td>
                    <td className="px-6 py-4 text-earth-600">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-lg p-2 text-earth-500 transition-colors hover:bg-cream-200 hover:text-terracotta-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
