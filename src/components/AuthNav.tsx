"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import SignOutButton from "@/components/SignOutButton";
import Icon from "@/components/Icon";

export default function AuthNav() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!ready) return null;

  if (email) {
    return (
      <div className="flex items-center gap-6 text-sm">
        <Link href="/today">Today</Link>
        <Link href="/calendar">Calendar</Link>
        <Link href="/settings">Settings</Link>
        <span className="opacity-70 hidden sm:inline">{email}</span>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 text-sm">
      <Link href="/login" className="inline-flex items-center gap-1">
        <Icon name="log-in" className="w-4 h-4" />
        <span>Sign in</span>
      </Link>
      <Link href="/signup" className="inline-flex items-center gap-1">
        <Icon name="user-plus" className="w-4 h-4" />
        <span>Sign up</span>
      </Link>
    </div>
  );
}

