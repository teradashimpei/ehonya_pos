"use client";

import { useRouter } from "next/navigation";

import LoginForm from "@/components/LoginForm";
import { saveUserName } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();

  function handleSuccess(name: string) {
    saveUserName(name);
    router.push("/");
  }

  return (
    <main className="page">
      <h1>絵本屋POS</h1>
      <LoginForm onSuccess={handleSuccess} />
    </main>
  );
}