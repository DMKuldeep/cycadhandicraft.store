"use client";

import { useTransition } from "react";
import { Mail, Check, MailOpen } from "lucide-react";
import type { Enquiry } from "@/types/database";
import { markEnquiryRead } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface EnquiryListProps {
  enquiries: Enquiry[];
}

export function EnquiryList({ enquiries }: EnquiryListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleRead = (id: string, isRead: boolean) => {
    startTransition(async () => {
      await markEnquiryRead(id, !isRead);
      router.refresh();
    });
  };

  if (enquiries.length === 0) {
    return (
      <div className="card p-8 text-center text-earth-500">
        No enquiries yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enquiries.map((enquiry) => (
        <div
          key={enquiry.id}
          className={`card p-6 ${!enquiry.is_read ? "border-l-4 border-l-terracotta-500" : ""}`}
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-earth-900">{enquiry.name}</h3>
                {!enquiry.is_read && (
                  <span className="rounded-full bg-terracotta-100 px-2 py-0.5 text-xs font-medium text-terracotta-700">
                    New
                  </span>
                )}
              </div>
              <a
                href={`mailto:${enquiry.email}`}
                className="flex items-center gap-1 break-all text-sm text-terracotta-600 hover:text-terracotta-700"
              >
                <Mail className="h-3 w-3" />
                {enquiry.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <time className="text-xs text-earth-400">
                {new Date(enquiry.created_at).toLocaleString("en-IN")}
              </time>
              <button
                onClick={() => toggleRead(enquiry.id, enquiry.is_read)}
                disabled={isPending}
                className="rounded-lg p-2 text-earth-500 transition-colors hover:bg-cream-200"
                title={enquiry.is_read ? "Mark as unread" : "Mark as read"}
              >
                {enquiry.is_read ? (
                  <MailOpen className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </button>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-earth-600">{enquiry.message}</p>
        </div>
      ))}
    </div>
  );
}
