"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SignOutButton from "@/components/SignOutButton";
import Icon from "@/components/Icon";

export default function AuthNav() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    // Determine auth via server using cookie session
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => {
        if (!mounted) return;
        if (res.ok) {
          const { profile } = await res.json();
          setEmail(profile?.email ?? null);
        } else {
          setEmail(null);
        }
      })
      .finally(() => {
        if (mounted) setReady(true);
      });
    const onFocus = () => {
      fetch("/api/me", { cache: "no-store" }).then(async (res) => {
        if (!mounted) return;
        if (res.ok) {
          const { profile } = await res.json();
          setEmail(profile?.email ?? null);
        } else setEmail(null);
      });
    };
    window.addEventListener("focus", onFocus);
    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
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
