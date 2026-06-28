"use client";

import { useState, useTransition } from "react";
import { Bell, Save, Info } from "lucide-react";
import { saveNotificationSettings } from "@/lib/actions";
import type { NotificationSettings } from "@/lib/queries";

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings;
}

export function NotificationSettingsForm({
  initialSettings,
}: NotificationSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await saveNotificationSettings(settings);
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Notification settings saved.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="card flex gap-4 p-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-500" />
        <div className="text-sm text-earth-600">
          <p className="mb-1 font-semibold text-earth-900">
            Contact form emails
          </p>
          <p>
            When someone submits the contact form, you can receive an email
            alert and optionally send them an automatic thank-you reply. Change
            the notification email anytime — no code changes needed.
          </p>
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

      <div className="card space-y-5 p-6">
        <div className="flex items-center gap-3 border-b border-cream-200 pb-4">
          <Bell className="h-5 w-5 text-terracotta-600" />
          <h2 className="font-serif text-xl font-semibold text-earth-900">
            Enquiry Notifications
          </h2>
        </div>

        <div>
          <label
            htmlFor="notificationEmail"
            className="mb-1 block text-sm font-medium text-earth-700"
          >
            Send new enquiries to this email
          </label>
          <input
            id="notificationEmail"
            type="email"
            value={settings.notificationEmail}
            onChange={(e) =>
              setSettings((s) => ({ ...s, notificationEmail: e.target.value }))
            }
            className="input-field"
            placeholder="you@example.com"
            required
          />
          <p className="mt-1 text-xs text-earth-500">
            Update this whenever you want enquiries sent to a different inbox.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="notifyOnEnquiry"
            checked={settings.notifyOnEnquiry}
            onChange={(e) =>
              setSettings((s) => ({ ...s, notifyOnEnquiry: e.target.checked }))
            }
            className="h-4 w-4 rounded border-earth-300 text-terracotta-600"
          />
          <label
            htmlFor="notifyOnEnquiry"
            className="text-sm font-medium text-earth-700"
          >
            Email me when a new enquiry is submitted
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="sendCustomerAutoReply"
            checked={settings.sendCustomerAutoReply}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                sendCustomerAutoReply: e.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-earth-300 text-terracotta-600"
          />
          <label
            htmlFor="sendCustomerAutoReply"
            className="text-sm font-medium text-earth-700"
          >
            Send automatic thank-you email to the customer
          </label>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Notification Settings"}
        </button>
      </div>
    </form>
  );
}
