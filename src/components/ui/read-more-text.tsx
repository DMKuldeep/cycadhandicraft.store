"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PRODUCT_DESCRIPTION_PREVIEW_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ReadMoreTextProps {
  text: string;
  previewLength?: number;
  className?: string;
}

export function ReadMoreText({
  text,
  previewLength = PRODUCT_DESCRIPTION_PREVIEW_LENGTH,
  className,
}: ReadMoreTextProps) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = text.length > previewLength;
  const displayText =
    expanded || !needsToggle ? text : `${text.slice(0, previewLength).trim()}…`;

  return (
    <div className={cn("space-y-3", className)}>
      <p className="whitespace-pre-line leading-relaxed text-earth-700">
        {displayText}
      </p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"
        >
          {expanded ? (
            <>
              Read less
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Read more
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
