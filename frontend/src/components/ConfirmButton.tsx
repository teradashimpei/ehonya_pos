"use client";

export default function ConfirmButton({
  itemCount,
  disabled,
  onConfirm,
}: {
  itemCount: number;
  disabled: boolean;
  onConfirm: () => void;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onConfirm}>
      購入を確定する
    </button>
  );
}