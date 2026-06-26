import { PageEditor } from "@/components/admin/page-editor";
import { createClient } from "@/lib/supabase/server";
import type { PageContent } from "@/types/database";

async function getAllPages(): Promise<PageContent[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("page_content").select("*");
  return data ?? [];
}

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
