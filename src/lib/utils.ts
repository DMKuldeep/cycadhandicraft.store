import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductImage(
  imageUrls: string[] | null | undefined,
  index = 0
): string {
  if (imageUrls && imageUrls.length > index && imageUrls[index]) {
    return imageUrls[index];
  }
  return `https://placehold.co/600x600/F5E6D3/8B6F47?text=Cycad+Handicrafts`;
}
