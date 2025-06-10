// utils/url.ts (or url.js if not using TypeScript)
export const createPurchaseUrl = (type: string, params: Record<string, string | number>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.append(key, encodeURIComponent(value.toString()));
  });
  return `/purchase/${encodeURIComponent(type)}?${query.toString()}`;
};