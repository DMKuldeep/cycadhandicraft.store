import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { getProductBySlug } from "@/lib/queries";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description ?? `Buy ${product.name} from Cycad Handicrafts`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <ProductDetail product={product} />
      </div>
    </section>
  );
}
