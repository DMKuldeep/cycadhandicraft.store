import { NotificationSettingsForm } from "@/components/admin/notification-settings-form";
import { PaymentSettingsForm } from "@/components/admin/payment-settings-form";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import {
  getNotificationSettings,
  getPaymentSettings,
  getSiteSettings,
} from "@/lib/queries";

export default async function AdminSettingsPage() {
  const [paymentSettings, notificationSettings, siteSettings] =
    await Promise.all([
      getPaymentSettings(),
      getNotificationSettings(),
      getSiteSettings(),
    ]);

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-bold text-earth-900">
        Settings
      </h1>
      <p className="mb-8 text-earth-600">
        Manage contact info, homepage content, email notifications, and payment
        configuration — no code changes needed.
      </p>
      <div className="space-y-10">
        <SiteSettingsForm initialSettings={siteSettings} />
        <NotificationSettingsForm initialSettings={notificationSettings} />
        <PaymentSettingsForm initialSettings={paymentSettings} />
      </div>
    </div>
  );
}
