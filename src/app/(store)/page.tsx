import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import { ContactForm } from "@/components/forms/contact-form";
import { InstagramIcon, FacebookIcon } from "@/components/ui/social-icons";
import { getProducts, getSiteSettings } from "@/lib/queries";

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: MessageCircle,
};

export default async function HomePage() {
  const [products, site] = await Promise.all([
    getProducts({ limit: 8 }),
    getSiteSettings(),
  ]);

  const socialLinks = [
    { name: "Instagram", href: site.instagramUrl, icon: "instagram" as const },
    { name: "Facebook", href: site.facebookUrl, icon: "facebook" as const },
    {
      name: "WhatsApp",
      href: `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`,
      icon: "whatsapp" as const,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-cream-50 to-terracotta-100">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-terracotta-300 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-amber-warm blur-3xl" />
        </div>
        <div className="container-narrow relative section-padding">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-4 py-1.5 text-sm font-medium text-terracotta-700">
                <Sparkles className="h-4 w-4" />
                {site.heroBadge}
              </div>
              <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-earth-900 sm:text-5xl lg:text-6xl">
                {site.heroTitle}{" "}
                <span className="text-terracotta-600">{site.heroHighlight}</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-earth-600">
                {site.heroDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary">
                  Shop Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about" className="btn-secondary">
                  Our Story
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={site.heroImageUrl}
                  alt="Handcrafted home décor collection"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-white p-4 shadow-lg">
                <p className="text-sm font-medium text-earth-500">Starting from</p>
                <p className="font-serif text-2xl font-bold text-terracotta-600">
                  ₹749
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Intro */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={site.aboutImageUrl}
                alt="Artisan crafting handicrafts"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-terracotta-600">
                {site.aboutSubtitle}
              </p>
              <h2 className="mb-6 font-serif text-3xl font-bold text-earth-900 sm:text-4xl">
                {site.aboutTitle}
              </h2>
              <p className="mb-4 leading-relaxed text-earth-600">
                {site.aboutText1}
              </p>
              <p className="mb-6 leading-relaxed text-earth-600">
                {site.aboutText2}
              </p>
              <Link href="/about" className="btn-secondary">
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-cream-100 section-padding">
        <div className="container-narrow">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-terracotta-600">
              Our Collection
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold text-earth-900 sm:text-4xl">
              Featured Handicrafts
            </h2>
            <p className="mx-auto max-w-2xl text-earth-600">
              Explore our curated selection of handcrafted home décor pieces,
              each one unique and made with care.
            </p>
          </div>
          <ProductGrid products={products} />
          <div className="mt-10 text-center">
            <Link href="/shop" className="btn-primary">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-padding">
        <div className="container-narrow">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-terracotta-600">
              Get in Touch
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold text-earth-900 sm:text-4xl">
              We&apos;d Love to Hear From You
            </h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="card p-4 sm:p-6 lg:p-8">
              <ContactForm />
            </div>
            <div className="space-y-6">
              <div className="card p-4 sm:p-6">
                <h3 className="mb-4 font-serif text-xl font-semibold text-earth-900">
                  Visit Our Workshop
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-earth-600">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-500" />
                    <span className="break-words">{site.address}</span>
                  </li>
                  <li>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-3 break-all text-earth-600 transition-colors hover:text-terracotta-600"
                    >
                      <Phone className="h-5 w-5 shrink-0 text-terracotta-500" />
                      {site.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="flex items-center gap-3 break-all text-earth-600 transition-colors hover:text-terracotta-600"
                    >
                      <Mail className="h-5 w-5 shrink-0 text-terracotta-500" />
                      {site.email}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card p-4 sm:p-6">
                <h3 className="mb-4 font-serif text-xl font-semibold text-earth-900">
                  Follow Us
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {socialLinks.map((social) => {
                    const Icon = socialIcons[social.icon];
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg bg-cream-100 px-4 py-2.5 text-sm font-medium text-earth-700 transition-colors hover:bg-terracotta-100 hover:text-terracotta-700 sm:justify-start"
                      >
                        <Icon className="h-4 w-4" />
                        {social.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
