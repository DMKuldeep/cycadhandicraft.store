"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitEnquiry(formData: FormData) {
  const parsed = enquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert(parsed.data);

  if (error) {
    console.error("Enquiry submission error:", error);
    return { error: "Failed to submit enquiry. Please try again." };
  }

  return { success: true };
}

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(10),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
    })
  ),
});

export async function createOrder(data: z.infer<typeof checkoutSchema>) {
  const parsed = checkoutSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid order data" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const total = parsed.data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      customer_name: parsed.data.customerName,
      customer_email: parsed.data.customerEmail,
      customer_phone: parsed.data.customerPhone ?? null,
      shipping_address: parsed.data.shippingAddress,
      total,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Order creation error:", orderError);
    return { error: "Failed to create order" };
  }

  const orderItems = parsed.data.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Order items error:", itemsError);
    return { error: "Failed to create order items" };
  }

  return { success: true, orderId: order.id };
}

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  categoryId: z.string().optional(),
  stock: z.coerce.number().min(0),
  imageUrls: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const imageUrlsRaw = formData.get("imageUrls") as string;
  const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId") || undefined,
    stock: formData.get("stock"),
    imageUrls,
    isActive: formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const slug = slugify(parsed.data.name);

  const { error } = await supabase.from("products").insert({
    name: parsed.data.name,
    slug,
    description: parsed.data.description ?? null,
    price: parsed.data.price,
    category_id: parsed.data.categoryId ?? null,
    stock: parsed.data.stock,
    image_urls: parsed.data.imageUrls,
    is_active: parsed.data.isActive,
  });

  if (error) {
    console.error("Create product error:", error);
    return { error: "Failed to create product" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const imageUrlsRaw = formData.get("imageUrls") as string;
  const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId") || undefined,
    stock: formData.get("stock"),
    imageUrls,
    isActive: formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const slug = slugify(parsed.data.name);

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.data.name,
      slug,
      description: parsed.data.description ?? null,
      price: parsed.data.price,
      category_id: parsed.data.categoryId ?? null,
      stock: parsed.data.stock,
      image_urls: parsed.data.imageUrls,
      is_active: parsed.data.isActive,
    })
    .eq("id", id);

  if (error) {
    console.error("Update product error:", error);
    return { error: "Failed to update product" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: "Failed to delete product" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { success: true };
}

const categorySchema = z.object({
  name: z.string().min(2),
  imageUrl: z.string().optional(),
});

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    imageUrl: formData.get("imageUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    image_url: parsed.data.imageUrl ?? null,
  });

  if (error) {
    return { error: "Failed to create category" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    imageUrl: formData.get("imageUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      image_url: parsed.data.imageUrl ?? null,
    })
    .eq("id", id);

  if (error) {
    return { error: "Failed to update category" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: "Failed to delete category" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function markEnquiryRead(id: string, isRead: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) {
    return { error: "Failed to update enquiry" };
  }

  revalidatePath("/admin/enquiries");
  return { success: true };
}

export async function updatePageContent(slug: string, title: string, content: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("page_content")
    .upsert({ slug, title, content, updated_at: new Date().toISOString() });

  if (error) {
    return { error: "Failed to update page content" };
  }

  revalidatePath(`/${slug}`);
  revalidatePath("/admin/pages");
  return { success: true };
}

export async function uploadProductImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload image" };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: "Failed to update order" };
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function adminLogin(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .single();

  if (!admin) {
    await supabase.auth.signOut();
    return { error: "You are not authorized as an admin" };
  }

  return { success: true };
}

export async function adminLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

export async function customerLogin(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password" };
  }
  return { success: true };
}

export async function customerRegister(email: string, password: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function customerLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
