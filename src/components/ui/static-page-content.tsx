import { cn } from "@/lib/utils";

interface StaticPageContentProps {
  title: string;
  content: string;
  className?: string;
}

export function StaticPageContent({
  content,
  className,
}: StaticPageContentProps) {
  return (
    <article className={cn("prose prose-earth max-w-none", className)}>
      <div
        className="prose-headings:font-serif prose-headings:text-earth-900 prose-p:text-earth-700 prose-a:text-terracotta-600 prose-strong:text-earth-800"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}

export function getDefaultPageContent(slug: string): { title: string; content: string } {
  const defaults: Record<string, { title: string; content: string }> = {
    about: {
      title: "About Us",
      content: `<p>Welcome to <strong>Cycad Handicrafts</strong> — where tradition meets artistry in every piece we create.</p>
        <p>Based in the heart of Farrukhabad, Uttar Pradesh, we are a family-run workshop dedicated to preserving India's rich handicraft heritage.</p>`,
    },
    faq: {
      title: "Frequently Asked Questions",
      content: `<p>Content coming soon. Please check back later or contact us directly.</p>`,
    },
    terms: {
      title: "Terms & Conditions",
      content: `<p>Content coming soon.</p>`,
    },
    privacy: {
      title: "Privacy Policy",
      content: `<p>Content coming soon.</p>`,
    },
    returns: {
      title: "Return & Refund Policy",
      content: `<p>Content coming soon.</p>`,
    },
  };
  return defaults[slug] ?? { title: "Page", content: "<p>Content not found.</p>" };
}
