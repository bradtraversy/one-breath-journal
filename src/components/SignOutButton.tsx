"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Icon from "./Icon";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  return (
    <button
      className="text-sm underline inline-flex items-center gap-1"
      onClick={async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/today");
      }}
    >
      <Icon name="log-out" className="w-4 h-4" />
      <span>Sign out</span>
    </button>
  );
}
