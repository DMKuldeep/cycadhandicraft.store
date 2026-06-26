import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <section className="border-b border-cream-200 bg-gradient-to-br from-cream-100 via-cream-50 to-terracotta-50">
      <div className="container-narrow section-padding !py-12 text-center sm:!py-16">
        <h1 className="mb-3 font-serif text-4xl font-bold text-earth-900 sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto max-w-2xl text-lg text-earth-600">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
