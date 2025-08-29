"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  return (
    <button
      className="text-sm underline"
      onClick={async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/today");
      }}
    >
      Sign out
    </button>
  );
}

