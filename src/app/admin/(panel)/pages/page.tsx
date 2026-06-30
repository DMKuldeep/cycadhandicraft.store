import { getAllPages } from "@/lib/queries";
import { PageEditor } from "@/components/admin/page-editor";

export default async function AdminPagesPage() {
  const pages = await getAllPages();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold text-earth-900">
        Page Content
      </h1>
      <PageEditor pages={pages} />
    </div>
  );
}
