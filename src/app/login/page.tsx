import { Suspense } from "react";
import LoginClient from "@/components/LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm opacity-70">Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
