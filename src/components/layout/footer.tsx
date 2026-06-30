import Link from "next/link";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import {
  SITE_NAME,
  FOOTER_QUICK_LINKS,
  FOOTER_CARE_LINKS,
} from "@/lib/constants";
import type { SiteSettings } from "@/lib/queries";
import { InstagramIcon, FacebookIcon } from "@/components/ui/social-icons";

const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: MessageCircle,
};

interface FooterProps {
  siteSettings: SiteSettings;
}

export function Footer({ siteSettings }: FooterProps) {
  const socialLinks = [
    {
      name: "Instagram",
      href: siteSettings.instagramUrl,
      icon: "instagram" as const,
    },
    {
      name: "Facebook",
      href: siteSettings.facebookUrl,
      icon: "facebook" as const,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`,
      icon: "whatsapp" as const,
    },
  ];

  return (
    <footer className="border-t border-cream-200 bg-earth-900 text-cream-100">
      <div className="container-narrow section-padding !py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 font-serif text-xl font-bold text-cream-50">
              {SITE_NAME}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-cream-300">
              Handcrafted home décor from the heart of Uttar Pradesh. Each piece
              tells a story of tradition, artistry, and love.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-earth-800 p-2 text-cream-300 transition-colors hover:bg-terracotta-600 hover:text-white"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-200">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300 transition-colors hover:text-terracotta-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-200">
              Customer Care
            </h4>
            <ul className="space-y-2">
              {FOOTER_CARE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-300 transition-colors hover:text-terracotta-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-200">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-cream-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-400" />
                <span className="break-words">{siteSettings.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${siteSettings.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 break-all text-sm text-cream-300 transition-colors hover:text-terracotta-300"
                >
                  <Phone className="h-4 w-4 shrink-0 text-terracotta-400" />
                  {siteSettings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="flex items-center gap-2 break-all text-sm text-cream-300 transition-colors hover:text-terracotta-300"
                >
                  <Mail className="h-4 w-4 shrink-0 text-terracotta-400" />
                  {siteSettings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-earth-800 pt-6 text-center text-sm text-cream-400">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
