import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/queries";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();

  return (
    <>
      <Header />
      <main className="min-h-screen min-w-0 overflow-x-hidden">{children}</main>
      <Footer siteSettings={siteSettings} />
    </>
  );
}
