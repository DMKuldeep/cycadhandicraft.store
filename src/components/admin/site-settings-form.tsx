"use client";

import { useState, useTransition } from "react";
import { Globe, Save } from "lucide-react";
import { saveSiteSettings } from "@/lib/actions";
import type { SiteSettings } from "@/lib/queries";
import { ImageUploadField } from "./image-upload-field";

interface SiteSettingsFormProps {
  initialSettings: SiteSettings;
}

export function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await saveSiteSettings(settings);
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Site content saved. Homepage and footer updated.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="card space-y-5 p-6">
        <div className="flex items-center gap-3 border-b border-cream-200 pb-4">
          <Globe className="h-5 w-5 text-terracotta-600" />
          <h2 className="font-serif text-xl font-semibold text-earth-900">
            Contact & Social
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Phone
            </label>
            <input
              value={settings.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              WhatsApp (digits only, e.g. +919569838076)
            </label>
            <input
              value={settings.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => set("email", e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Address
            </label>
            <input
              value={settings.address}
              onChange={(e) => set("address", e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Instagram URL
            </label>
            <input
              type="url"
              value={settings.instagramUrl}
              onChange={(e) => set("instagramUrl", e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Facebook URL
            </label>
            <input
              type="url"
              value={settings.facebookUrl}
              onChange={(e) => set("facebookUrl", e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      <div className="card space-y-5 p-6">
        <h2 className="border-b border-cream-200 pb-4 font-serif text-xl font-semibold text-earth-900">
          Homepage — Hero Section
        </h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Badge text
          </label>
          <input
            value={settings.heroBadge}
            onChange={(e) => set("heroBadge", e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Headline (line 1)
            </label>
            <input
              value={settings.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-earth-700">
              Headline highlight (line 2, colored)
            </label>
            <input
              value={settings.heroHighlight}
              onChange={(e) => set("heroHighlight", e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Hero description
          </label>
          <textarea
            value={settings.heroDescription}
            onChange={(e) => set("heroDescription", e.target.value)}
            rows={3}
            className="input-field resize-y"
            required
          />
        </div>
        <ImageUploadField
          label="Hero image"
          value={settings.heroImageUrl}
          onChange={(url) => set("heroImageUrl", url)}
          hint="Large image on the right side of the homepage hero."
        />
      </div>

      <div className="card space-y-5 p-6">
        <h2 className="border-b border-cream-200 pb-4 font-serif text-xl font-semibold text-earth-900">
          About Page & Homepage Section
        </h2>
        <p className="text-sm text-earth-500">
          Image uploads here. About page text is edited under{" "}
          <strong>Admin → Pages → About Us</strong>.
        </p>
        <ImageUploadField
          label="About page image"
          value={settings.aboutImageUrl}
          onChange={(url) => set("aboutImageUrl", url)}
          hint="Shown on the About Us page and the homepage about section. Upload your artisan/workshop photo here."
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Small label
          </label>
          <input
            value={settings.aboutSubtitle}
            onChange={(e) => set("aboutSubtitle", e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Section title
          </label>
          <input
            value={settings.aboutTitle}
            onChange={(e) => set("aboutTitle", e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Paragraph 1
          </label>
          <textarea
            value={settings.aboutText1}
            onChange={(e) => set("aboutText1", e.target.value)}
            rows={3}
            className="input-field resize-y"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Paragraph 2
          </label>
          <textarea
            value={settings.aboutText2}
            onChange={(e) => set("aboutText2", e.target.value)}
            rows={3}
            className="input-field resize-y"
            required
          />
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.includes("saved")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <button type="submit" disabled={isPending} className="btn-primary">
        <Save className="h-4 w-4" />
        {isPending ? "Saving..." : "Save Site Content"}
      </button>
    </form>
  );
}
