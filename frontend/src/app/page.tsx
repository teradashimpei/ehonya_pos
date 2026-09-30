"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmButton from "@/components/ConfirmButton";
import ConfirmModal from "@/components/ConfirmModal";
import Header from "@/components/Header";
import MemberInput from "@/components/MemberInput";
import ProductSearch from "@/components/ProductSearch";
import PurchaseList from "@/components/PurchaseList";
import { createTransaction, logout } from "@/lib/api";
import { addPurchaseItem } from "@/lib/purchaseList";
import { clearUserName, loadUserName } from "@/lib/session";
import type { Customer, Product, PurchaseLine } from "@/types";

export default function PosPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<PurchaseLine[]>([]);
  const [totals, setTotals] = useState<{ withTax: number; withoutTax: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const name = loadUserName();
    if (!name) {
      router.replace("/login");
      return;
    }
    setUserName(name);
  }, [router]);

  async function handleLogout() {
    await logout();
    clearUserName();
    router.replace("/login");
  }

  function handleIdentify(memberId: string, name: string) {
    setCustomer({ kind: "member", memberId, name });
  }

  function handleGuest() {
    setCustomer({ kind: "guest" });
  }

  function handleAdd(product: Product): string | null {
    const result = addPurchaseItem(items, product);
    if (!result.ok) return result.error;
    setItems(result.items);
    return null;
  }

  async function handleConfirm() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const memberId = customer?.kind === "member" ? customer.memberId : null;
      const result = await createTransaction(memberId, items.map((i) => i.productCode));
      setTotals({ withTax: result.total_with_tax, withoutTax: result.total_without_tax });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setCustomer(null);
    setItems([]);
    setTotals(null);
    setResetKey((k) => k + 1);
  }

  if (!userName) return null;

  return (
    <main className="page">
      <Header userName={userName} onLogout={handleLogout} />
      <MemberInput key={resetKey} customer={customer} onIdentify={handleIdentify} onGuest={handleGuest} />
      <ProductSearch disabled={customer === null} onAdd={handleAdd} />
      <PurchaseList items={items} />
      <ConfirmButton
        itemCount={items.length}
        disabled={items.length === 0 || isSubmitting || totals !== null}
        onConfirm={handleConfirm}
      />
      {totals && (
        <ConfirmModal totalWithoutTax={totals.withoutTax} totalWithTax={totals.withTax} onClose={handleClose} />
      )}
    </main>
  );
}