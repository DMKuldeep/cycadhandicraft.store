"use client";

import { useState, useTransition } from "react";
import { CreditCard, Save, Info } from "lucide-react";
import { savePaymentSettings } from "@/lib/actions";
import type { PaymentSettings } from "@/lib/queries";

interface PaymentSettingsFormProps {
  initialSettings: PaymentSettings;
}

export function PaymentSettingsForm({
  initialSettings,
}: PaymentSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await savePaymentSettings(settings);
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Payment settings saved. PayU checkout will activate once integrated.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="card flex gap-4 p-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-500" />
        <div className="text-sm text-earth-600">
          <p className="mb-1 font-semibold text-earth-900">
            PayU integration — coming next
          </p>
          <p>
            Save your PayU credentials here now. When payment goes live, checkout
            will use these settings automatically — no code changes needed by you.
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
          <CreditCard className="h-5 w-5 text-terracotta-600" />
          <h2 className="font-serif text-xl font-semibold text-earth-900">
            PayU Payment Gateway
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="payuEnabled"
            checked={settings.enabled}
            onChange={(e) =>
              setSettings((s) => ({ ...s, enabled: e.target.checked }))
            }
            className="h-4 w-4 rounded border-earth-300 text-terracotta-600"
          />
          <label htmlFor="payuEnabled" className="text-sm font-medium text-earth-700">
            Enable PayU payments (when integration is live)
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Merchant Key
          </label>
          <input
            value={settings.payuMerchantKey}
            onChange={(e) =>
              setSettings((s) => ({ ...s, payuMerchantKey: e.target.value }))
            }
            className="input-field font-mono text-sm"
            placeholder="Your PayU merchant key"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Merchant Salt
          </label>
          <input
            type="password"
            value={settings.payuMerchantSalt}
            onChange={(e) =>
              setSettings((s) => ({ ...s, payuMerchantSalt: e.target.value }))
            }
            className="input-field font-mono text-sm"
            placeholder="Your PayU salt"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-earth-700">
            Mode
          </label>
          <select
            value={settings.payuMode}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                payuMode: e.target.value as "test" | "live",
              }))
            }
            className="input-field"
          >
            <option value="test">Test / Sandbox</option>
            <option value="live">Live / Production</option>
          </select>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Payment Settings"}
        </button>
      </div>
    </form>
  );
}
