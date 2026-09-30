"use client";

import { useState } from "react";
import { fetchMember } from "@/lib/api";
import type { Customer } from "@/types";

export default function MemberInput({
  customer,
  onIdentify,
  onGuest,
}: {
  customer: Customer | null;
  onIdentify: (memberId: string, name: string) => void;
  onGuest: () => void;
}) {
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!/^\d{6}$/.test(memberId)) {
      setError("会員IDは6桁の数字で入力してください");
      return;
    }
    try {
      const member = await fetchMember(memberId);
      onIdentify(member.member_id, member.name);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "会員照会に失敗しました");
    }
  }

  if (customer) {
    return (
      <p>
        {customer.kind === "member" ? `${customer.name} 様` : "非会員のお客様"}
      </p>
    );
  }

  return (
    <div>
      <label>
        会員ID
        <input value={memberId} onChange={(e) => setMemberId(e.target.value)} />
      </label>
      <button type="button" onClick={handleSearch}>照会</button>
      <button type="button" onClick={onGuest}>非会員で進む</button>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}