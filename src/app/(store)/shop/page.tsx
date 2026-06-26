import { Suspense } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { ShopContent } from "@/components/shop/shop-content";
import { getCategories } from "@/lib/queries";

export const metadata = {
  title: "Shop",
  description: "Browse our collection of handcrafted home décor items.",
};

export default async function ShopPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHero
        title="Shop Our Collection"
        subtitle="Handcrafted home décor pieces made with love by skilled artisans"
      />
      <section className="section-padding">
        <div className="container-narrow">
          <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
            <ShopContent categories={categories} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
