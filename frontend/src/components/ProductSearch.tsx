"use client";

import { useState } from "react";
import { fetchProduct } from "@/lib/api";
import type { Product } from "@/types";

export default function ProductSearch({
  disabled,
  onAdd,
}: {
  disabled: boolean;
  onAdd: (product: Product) => string | null;
}) {
  const [productCode, setProductCode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!/^\d{13}$/.test(productCode)) {
      setError("商品コードは13桁の数字で入力してください");
      setProductCode("");
      return;
    }
    try {
      const result = await fetchProduct(productCode);
      setProduct(result);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "商品検索に失敗しました");
      setProductCode("");
    }
  }

  function handleAdd() {
    if (!product) return;
    const errorMessage = onAdd(product);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    setProductCode("");
    setProduct(null);
    setError("");
  }

  return (
    <div>
      <label>
        商品コード
        <input
          disabled={disabled}
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
        />
      </label>
      <button type="button" disabled={disabled} onClick={handleSearch}>検索</button>

      <p>名称：{product ? product.name : "—"}</p>
      <p>単価：{product ? `¥${product.unit_price.toLocaleString()}` : "—"}</p>
      <button type="button" onClick={handleAdd} disabled={!product}>リストに追加</button>

      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}