import { createClient } from "@/lib/supabase/server";
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
