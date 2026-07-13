export const exploreCollection = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL as string);
  const data = await res.json();
  return data;
};

export const exploreProductById = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
};