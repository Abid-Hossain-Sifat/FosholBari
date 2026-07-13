export interface ExploreFilters {
  categories?: string[];
  tags?: string[];
  maxPrice?: number;
  sort?: string;
  page?: number;
}

export const exploreCollection = async (filters?: ExploreFilters) => {
  let url = process.env.NEXT_PUBLIC_API_URL as string;
  if (filters) {
    const params = new URLSearchParams();
    if (filters.categories && filters.categories.length > 0) {
      params.append("categories", filters.categories.join(","));
    }
    if (filters.tags && filters.tags.length > 0) {
      params.append("tags", filters.tags.join(","));
    }
    if (filters.maxPrice !== undefined) {
      params.append("maxPrice", filters.maxPrice.toString());
    }
    if (filters.sort) {
      params.append("sort", filters.sort);
    }
    if (filters.page && filters.page > 1) {
      params.append("page", filters.page.toString());
    }
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const res = await fetch(url);
  const json = await res.json();
  // Return paginated shape: { data, totalCount, totalPages, currentPage }
  return json;
};

export const exploreProductById = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
};

export const exploreFiltersMeta = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/filters`);
  if (!res.ok) return { categories: [], tags: [] };
  const data = await res.json();
  return data;
};