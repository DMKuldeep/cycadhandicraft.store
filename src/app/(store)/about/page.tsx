import { PageHero } from "@/components/ui/page-hero";
import {
  StaticPageContent,
  getDefaultPageContent,
} from "@/components/ui/static-page-content";
import { getPageContent } from "@/lib/queries";

export async function generateMetadata() {
  return { title: "About Us" };
}

export default async function AboutPage() {
  const page = await getPageContent("about");
  const fallback = getDefaultPageContent("about");

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
