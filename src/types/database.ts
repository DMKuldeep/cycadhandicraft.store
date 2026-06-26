export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  stock: number;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
  categories?: Category | null;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  created_at: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  total: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc";
