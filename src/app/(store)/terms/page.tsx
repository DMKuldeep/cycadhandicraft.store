import { PageHero } from "@/components/ui/page-hero";
import {
  StaticPageContent,
  getDefaultPageContent,
} from "@/components/ui/static-page-content";
import { getPageContent } from "@/lib/queries";

export async function generateMetadata() {
  return { title: "Terms & Conditions" };
}

export default async function TermsPage() {
  const page = await getPageContent("terms");
  const fallback = getDefaultPageContent("terms");

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
