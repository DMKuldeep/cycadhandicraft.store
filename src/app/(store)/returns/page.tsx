import { PageHero } from "@/components/ui/page-hero";
import {
  StaticPageContent,
  getDefaultPageContent,
} from "@/components/ui/static-page-content";
import { getPageContent } from "@/lib/queries";

export async function generateMetadata() {
  return { title: "Returns & Refunds" };
}

export default async function ReturnsPage() {
  const page = await getPageContent("returns");
  const fallback = getDefaultPageContent("returns");

  return (
    <>
      <PageHero title={page?.title ?? fallback.title} />
      <section className="section-padding">
        <div className="container-narrow max-w-3xl">
          <StaticPageContent
            title={page?.title ?? fallback.title}
            content={page?.content ?? fallback.content}
          />
        </div>
      </section>
    </>
  );
}
