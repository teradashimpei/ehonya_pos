"use client";

export default function ConfirmModal({
  totalWithoutTax,
  totalWithTax,
  onClose,
}: {
  totalWithoutTax: number;
  totalWithTax: number;
  onClose: () => void;
}) {
  return (
    <div className="modal">
      <p>ご購入ありがとうございました</p>
      <p>税抜合計：¥{totalWithoutTax.toLocaleString()}</p>
      <p>税込合計：¥{totalWithTax.toLocaleString()}</p>
      <button type="button" onClick={onClose}>閉じる</button>
      <p>※閉じると次のお客様の会員ID入力から再開できます</p>
    </div>
  );
}