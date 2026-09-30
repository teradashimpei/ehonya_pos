import type { Product, PurchaseLine } from "@/types";

const MAX_ITEMS = 50;

export function addPurchaseItem(
  items: PurchaseLine[],
  product: Product,
): { ok: true; items: PurchaseLine[] } | { ok: false; error: string } {
  if (items.length >= MAX_ITEMS) {
    return { ok: false, error: "1回の会計で登録できるのは50冊までです" };
  }
  const newLine: PurchaseLine = {
    lineId: crypto.randomUUID(),
    productCode: product.product_code,
    name: product.name,
    unitPrice: product.unit_price,
  };
  return { ok: true, items: [...items, newLine] };
}