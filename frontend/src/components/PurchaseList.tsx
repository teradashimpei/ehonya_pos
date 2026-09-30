import type { PurchaseLine } from "@/types";

export default function PurchaseList({ items }: { items: PurchaseLine[] }) {
  if (items.length === 0) {
    return <p>まだ商品が登録されていません</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.lineId}>
          {item.name}　1冊　¥{item.unitPrice.toLocaleString()}
        </li>
      ))}
    </ul>
  );
}