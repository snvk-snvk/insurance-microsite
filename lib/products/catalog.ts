// Mock product catalog for the admin portal's create-journey flow. Only
// "health" is actually wired to a working customer journey today; the rest are
// cosmetic options so the portal reads like a multi-product console.
export const PRODUCTS = [
  { id: "health", label: "Health Insurance" },
  { id: "motor", label: "Motor Insurance" },
  { id: "life", label: "Life Insurance" },
  { id: "travel", label: "Travel Insurance" },
] as const;

export type ProductId = (typeof PRODUCTS)[number]["id"];

export const DEFAULT_PRODUCT_ID: ProductId = "health";

export function productLabel(id: string): string {
  return PRODUCTS.find((p) => p.id === id)?.label ?? id;
}
