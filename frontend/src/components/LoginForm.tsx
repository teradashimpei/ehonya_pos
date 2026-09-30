"use client";

import { useState } from "react";
import { login } from "@/lib/api";

export default function LoginForm({ onSuccess }: { onSuccess: (name: string) => void }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!employeeId || !password) {
      setError("担当者IDとパスワードを入力してください");
      return;
    }
    try {
      const result = await login(employeeId, password);
      onSuccess(result.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ログインに失敗しました");
    }
  }

  return (
    <div>
      <label>
        担当者ID
        <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
      </label>
      <label>
        パスワード
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="button" onClick={handleSubmit}>ログイン</button>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}