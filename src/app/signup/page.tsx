import { Suspense } from "react";
import SignupClient from "@/components/SignupClient";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-sm opacity-70">Loading…</div>}>
      <SignupClient />
    </Suspense>
  );
}
