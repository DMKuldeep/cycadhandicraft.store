import { EnquiryList } from "@/components/admin/enquiry-list";
import { getEnquiries } from "@/lib/queries";

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold text-earth-900">
        Enquiries
      </h1>
      <EnquiryList enquiries={enquiries} />
    </div>
  );
}
