import { createClient } from "@/lib/supabase/server";
import { CONTACT, SITE_TAGLINE } from "@/lib/constants";
import type { Product, Category, Enquiry, PageContent, Order } from "@/types/database";
import type { SortOption } from "@/types/database";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data ?? [];
}

export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  sort?: SortOption;
  limit?: number;
  activeOnly?: boolean;
}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, categories(*)")
    .eq("is_active", options?.activeOnly !== false);

  if (options?.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  switch (options?.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "name-asc":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data as Product;
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_content")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching page content:", error);
    return null;
  }
  return data;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching enquiries:", error);
    return [];
  }
  return data ?? [];
}

export async function getDashboardStats() {
  const supabase = await createClient();

  const [products, categories, enquiries, orders] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase.from("orders").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalProducts: products.count ?? 0,
    totalCategories: categories.count ?? 0,
    unreadEnquiries: enquiries.count ?? 0,
    totalOrders: orders.count ?? 0,
  };
}

export async function getRecentEnquiries(limit = 5): Promise<Enquiry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as Product[];
}

export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4
): Promise<Product[]> {
  if (!categoryId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .limit(limit);

  if (error) return [];
  return (data ?? []) as Product[];
}

export async function getAllPages(): Promise<PageContent[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("page_content").select("*");
  return data ?? [];
}

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .single();

  return !!data;
}

export interface PaymentSettings {
  payuMerchantKey: string;
  payuMerchantSalt: string;
  payuMode: "test" | "live";
  enabled: boolean;
}

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  payuMerchantKey: "",
  payuMerchantSalt: "",
  payuMode: "test",
  enabled: false,
};

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("content")
    .eq("slug", "payment-settings")
    .single();

  if (!data?.content) return DEFAULT_PAYMENT_SETTINGS;

  try {
    return { ...DEFAULT_PAYMENT_SETTINGS, ...JSON.parse(data.content) };
  } catch {
    return DEFAULT_PAYMENT_SETTINGS;
  }
}

export interface NotificationSettings {
  notificationEmail: string;
  notifyOnEnquiry: boolean;
  sendCustomerAutoReply: boolean;
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  notificationEmail: CONTACT.email,
  notifyOnEnquiry: true,
  sendCustomerAutoReply: true,
};

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("content")
    .eq("slug", "notification-settings")
    .single();

  if (!data?.content) return DEFAULT_NOTIFICATION_SETTINGS;

  try {
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(data.content) };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export interface SiteSettings {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  aboutSubtitle: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: CONTACT.phone,
  email: CONTACT.email,
  whatsapp: CONTACT.whatsapp,
  address: CONTACT.address,
  instagramUrl: "https://instagram.com/cycadhandicrafts",
  facebookUrl: "https://facebook.com/cycadhandicrafts",
  heroBadge: "Artisanal Home Décor",
  heroTitle: "Handcrafted with Love,",
  heroHighlight: "Made Just for You",
  heroDescription:
    "Discover exquisite handcrafted home décor — from traditional diyas and idols to elegant ceramics and stone carvings, each piece crafted by skilled artisans in Farrukhabad.",
  heroImageUrl:
    "https://placehold.co/800x800/F5E6D3/8B6F47?text=Cycad+Handicrafts",
  aboutImageUrl:
    "https://placehold.co/800x600/F5E6D3/8B6F47?text=Our+Artisans",
  aboutSubtitle: "Our Story",
  aboutTitle: "Tradition Woven Into Every Piece",
  aboutText1: `${SITE_TAGLINE} — at Cycad Handicrafts, we believe that the beauty of handmade artistry lies in its imperfections, its warmth, and the stories each piece carries.`,
  aboutText2:
    "From our workshop in Barjhala, Farrukhabad, our artisans pour their hearts into creating tealight diyas, brass idols, ceramic vases, marble sculptures, and wooden crafts that bring the essence of Indian craftsmanship into modern homes.",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_content")
    .select("content")
    .eq("slug", "site-settings")
    .single();

  if (!data?.content) return DEFAULT_SITE_SETTINGS;

  try {
    return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(data.content) };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
