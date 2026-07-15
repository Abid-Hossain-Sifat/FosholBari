const BASE = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:11111";
const EXPLORE_URL = process.env.NEXT_PUBLIC_EXPLORE_URL || `${BASE}/explore`;
const ORDERS_URL = process.env.NEXT_PUBLIC_ORDERS_URL || `${BASE}/orders`;
const DEMANDS_URL = process.env.NEXT_PUBLIC_DEMANDS_URL || `${BASE}/demands`;
const BAZAR_NOTES_URL = process.env.NEXT_PUBLIC_BAZAR_NOTES_URL || `${BASE}/bazar-notes`;
const PROFILE_URL = process.env.NEXT_PUBLIC_PROFILE_URL || `${BASE}/profile`;
const STATS_URL = process.env.NEXT_PUBLIC_STATS_URL || `${BASE}/stats`;
const ADMIN_URL = `${BASE}/admin`;

// ══════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════

export interface ExploreFilters {
  categories?: string[];
  tags?: string[];
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  farmerId?: string;
  search?: string;
}

// ══════════════════════════════════════════════════════════════════
// EXPLORE / PRODUCTS
// ══════════════════════════════════════════════════════════════════

export const exploreCollection = async (filters?: ExploreFilters) => {
  const params = new URLSearchParams();
  if (filters?.categories?.length)
    params.append("categories", filters.categories.join(","));
  if (filters?.tags?.length) params.append("tags", filters.tags.join(","));
  if (filters?.maxPrice !== undefined)
    params.append("maxPrice", filters.maxPrice.toString());
  if (filters?.sort) params.append("sort", filters.sort);
  if (filters?.page && filters.page > 1)
    params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.farmerId) params.append("farmerId", filters.farmerId);
  if (filters?.search) params.append("search", filters.search);

  const query = params.toString();
  const url = query ? `${EXPLORE_URL}?${query}` : EXPLORE_URL;
  const res = await fetch(url, { credentials: "include" });
  return res.json();
};

export const exploreProductById = async (id: string) => {
  const res = await fetch(`${EXPLORE_URL}/${id}`);
  if (!res.ok) return null;
  return res.json();
};

export const exploreFiltersMeta = async () => {
  const res = await fetch(`${EXPLORE_URL}/filters`);
  if (!res.ok) return { categories: [], tags: [] };
  return res.json();
};

export const addProduct = async (data: object) => {
  const res = await fetch(EXPLORE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateProduct = async (id: string, data: object) => {
  const res = await fetch(`${EXPLORE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(`${EXPLORE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "পণ্যটি মুছতে ব্যর্থ হয়েছে।");
  }
  return res.json();
};

// ══════════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════════

export const getOrders = async (role: "buyer" | "farmer") => {
  const res = await fetch(`${ORDERS_URL}?role=${role}`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  return res.json();
};

export const createOrder = async (data: {
  productId: string;
  qty?: number;
  weight?: string;
  address?: string;
  phone?: string;
}) => {
  const res = await fetch(ORDERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || "অর্ডার করতে ব্যর্থ হয়েছে।");
  }
  return json;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const res = await fetch(`${ORDERS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে।");
  }
  return json;
};

// ══════════════════════════════════════════════════════════════════
// DEMANDS
// ══════════════════════════════════════════════════════════════════

export const getDemands = async (my?: boolean) => {
  const url = my ? `${DEMANDS_URL}?my=true` : DEMANDS_URL;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) return [];
  return res.json();
};

export const createDemand = async (data: object) => {
  const res = await fetch(DEMANDS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const addDemandComment = async (id: string, text: string) => {
  const res = await fetch(`${DEMANDS_URL}/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || "মন্তব্য/প্রস্তাব যোগ করতে ব্যর্থ হয়েছে।");
  }
  return json;
};

export const updateDemand = async (id: string, data: object) => {
  const res = await fetch(`${DEMANDS_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteDemand = async (id: string) => {
  const res = await fetch(`${DEMANDS_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
};

// ══════════════════════════════════════════════════════════════════
// BAZAR NOTES
// ══════════════════════════════════════════════════════════════════

export const getBazarNotes = async () => {
  const res = await fetch(BAZAR_NOTES_URL, { credentials: "include" });
  if (!res.ok) return [];
  return res.json();
};

export const createBazarNote = async (data: object) => {
  const res = await fetch(BAZAR_NOTES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateBazarNote = async (id: string, data: object) => {
  const res = await fetch(`${BAZAR_NOTES_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteBazarNote = async (id: string) => {
  const res = await fetch(`${BAZAR_NOTES_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
};

// ══════════════════════════════════════════════════════════════════
// EXTENDED PROFILE
// ══════════════════════════════════════════════════════════════════

// All optional fields that either Farmer or Buyer may send to /profile PATCH
export interface ProfileUpdatePayload {
  // Common
  phone?: string;
  image?: string | null;
  // Buyer-specific
  location?: string;
  // Farmer-specific
  nid?: string;
  farmName?: string;
  farmLocation?: string;
  bio?: string;
  bkash?: string;
  nagad?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
}

export const getProfile = async () => {
  const res = await fetch(PROFILE_URL, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const updateProfile = async (data: ProfileUpdatePayload) => {
  const res = await fetch(PROFILE_URL, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

// ══════════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════════

export const getFarmerStats = async () => {
  const res = await fetch(`${STATS_URL}/farmer`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
};

export const getBuyerStats = async () => {
  const res = await fetch(`${STATS_URL}/buyer`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
};

// ══════════════════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════════════════

export const getAdminStats = async () => {
  const res = await fetch(`${STATS_URL}/admin`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
};

export const getAdminUsers = async () => {
  const res = await fetch(`${ADMIN_URL}/users`, { credentials: "include" });
  if (!res.ok) return [];
  return res.json();
};

export const updateUserRole = async (id: string, role: string) => {
  const res = await fetch(`${ADMIN_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "ব্যবহারকারী আপডেট করতে ব্যর্থ হয়েছে।");
  return json;
};

export const deleteUser = async (id: string) => {
  const res = await fetch(`${ADMIN_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("ব্যবহারকারী মুছতে ব্যর্থ হয়েছে।");
  return res.json();
};

export const getAdminOrders = async () => {
  const res = await fetch(`${ADMIN_URL}/orders`, { credentials: "include" });
  if (!res.ok) return [];
  return res.json();
};

export const updateAnyOrderStatus = async (id: string, status: string) => {
  const res = await fetch(`${ADMIN_URL}/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "অর্ডার আপডেট করতে ব্যর্থ হয়েছে।");
  return json;
};

export const deleteAnyOrder = async (id: string) => {
  const res = await fetch(`${ADMIN_URL}/orders/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("অর্ডার মুছতে ব্যর্থ হয়েছে।");
  return res.json();
};

export const deleteAnyProduct = async (id: string) => {
  const res = await fetch(`${ADMIN_URL}/explore/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("পণ্য মুছতে ব্যর্থ হয়েছে।");
  return res.json();
};

export const deleteAnyDemand = async (id: string) => {
  const res = await fetch(`${ADMIN_URL}/demands/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("চাহিদা মুছতে ব্যর্থ হয়েছে।");
  return res.json();
};

// ══════════════════════════════════════════════════════════════════
// IMAGE UPLOAD  (ImageBB)
// ══════════════════════════════════════════════════════════════════

export const uploadToImageBB = async (base64Image: string): Promise<string> => {
  const base64Data = base64Image.includes(",")
    ? base64Image.split(",")[1]
    : base64Image;
  const formData = new FormData();
  formData.append("image", base64Data);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API}`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!data.success) throw new Error("ImageBB upload failed");
  return data.data.url as string;
};