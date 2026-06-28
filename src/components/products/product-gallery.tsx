"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.min(
        100,
        Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)
      );
      const y = Math.min(
        100,
        Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)
      );
      setZoomPos({ x, y });
    },
    []
  );

  const goTo = (index: number) => {
    setSelected((index + images.length) % images.length);
  };

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Thumbnails — vertical on desktop */}
        {images.length > 1 && (
          <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:max-h-[520px] lg:w-20 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setSelected(i)}
                onClick={() => setSelected(i)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-cream-50 transition-all lg:h-[72px] lg:w-[72px]",
                  selected === i
                    ? "border-terracotta-600 ring-2 ring-terracotta-200"
                    : "border-cream-200 hover:border-terracotta-300"
                )}
              >
                <Image
                  src={img}
                  alt={`${productName} view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image + zoom panel */}
        <div className="relative order-1 flex-1 lg:order-2 lg:flex lg:gap-4">
          <div
            className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 lg:max-w-[520px]"
            onMouseEnter={() => setZooming(true)}
            onMouseLeave={() => setZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={images[selected]}
              alt={productName}
              fill
              className="object-cover transition-transform duration-200"
              style={
                zooming
                  ? {
                      transform: "scale(1.75)",
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-earth-900/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-earth-700 shadow-sm backdrop-blur-sm lg:hidden">
              <ZoomIn className="h-3.5 w-3.5" />
              Pinch or tap to expand
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-earth-700 shadow-md transition hover:bg-white"
            >
              <Expand className="h-3.5 w-3.5" />
              Full view
            </button>
          </div>

          {/* Desktop zoom preview panel (Flipkart-style) */}
          {zooming && (
            <div className="relative hidden aspect-square w-full max-w-[520px] overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 lg:block">
              <Image
                src={images[selected]}
                alt={`${productName} zoomed`}
                fill
                className="object-cover"
                style={{
                  transform: "scale(2.2)",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
                sizes="520px"
              />
              <div className="absolute left-3 top-3 rounded-full bg-earth-900/70 px-2.5 py-1 text-xs font-medium text-white">
                Zoom preview
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-earth-900/95 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(selected - 1);
                }}
                className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(selected + 1);
                }}
                className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-full max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selected]}
              alt={productName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {images.length > 1 && (
            <p className="absolute bottom-6 text-sm text-cream-300">
              {selected + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}
