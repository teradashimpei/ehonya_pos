"use client";

export default function Header({
  userName,
  onLogout,
}: {
  userName: string;
  onLogout: () => void;
}) {
  return (
    <header>
      <span>ログイン中：{userName}</span>
      <button type="button" onClick={onLogout}>ログアウト</button>
    </header>
  );
}