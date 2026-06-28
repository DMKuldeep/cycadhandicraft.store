import { NotificationSettingsForm } from "@/components/admin/notification-settings-form";
import { PaymentSettingsForm } from "@/components/admin/payment-settings-form";
import { getNotificationSettings, getPaymentSettings } from "@/lib/queries";

export default async function AdminSettingsPage() {
  const [paymentSettings, notificationSettings] = await Promise.all([
    getPaymentSettings(),
    getNotificationSettings(),
  ]);

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-bold text-earth-900">
        Settings
      </h1>
      <p className="mb-8 text-earth-600">
        Manage store configuration. Products, categories, orders, and pages are
        all controlled from this admin panel.
      </p>
      <div className="space-y-10">
        <NotificationSettingsForm initialSettings={notificationSettings} />
        <PaymentSettingsForm initialSettings={paymentSettings} />
      </div>
    </div>
  );
}
