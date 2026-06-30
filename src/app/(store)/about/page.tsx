import Image from "next/image";
import { StaticPageContent, getDefaultPageContent } from "@/components/ui/static-page-content";
import { getPageContent, getSiteSettings } from "@/lib/queries";

export async function generateMetadata() {
  return { title: "About Us" };
}

export default async function AboutPage() {
  const [page, site] = await Promise.all([
    getPageContent("about"),
    getSiteSettings(),
  ]);
  const fallback = getDefaultPageContent("about");
  const title = page?.title ?? fallback.title;
  const content = page?.content ?? fallback.content;

  return (
    <section className="bg-earth-50 section-padding">
      <div className="container-narrow">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* Image — upload from Admin → Settings */}
          <div className="relative order-1 mx-auto w-full max-w-xl lg:order-1 lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream-200 shadow-[0_20px_50px_-12px_rgba(26,20,12,0.18)]">
              <Image
                src={site.aboutImageUrl}
                alt="Cycad Handicrafts artisans at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Text — edit in Admin → Pages */}
          <div className="order-2 lg:order-2">
            <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-earth-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {title}
            </h1>
            <StaticPageContent
              title={title}
              content={content}
              className="text-base leading-relaxed sm:text-lg [&_.prose_p]:mb-5 [&_.prose_p]:text-earth-700 [&_.prose_strong]:font-semibold [&_.prose_strong]:text-earth-900"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
