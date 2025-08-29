"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";

export default function SignupPage() {
  const router = useRouter();
  const search = useSearchParams();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const nextUrl = search?.get("next") || "/today";

  // If already signed in, go to Today immediately
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/today");
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      if (data?.user?.confirmation_sent_at) {
        setInfo("Check your email to confirm your account.");
      } else {
        router.push(nextUrl);
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
      {search?.get("next") && (
        <div className="text-xs opacity-70">Create an account to continue.</div>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-black text-white w-full dark:bg-white dark:text-black inline-flex items-center justify-center gap-2"
          disabled={loading}
        >
          <Icon name="user-plus" className="w-4 h-4" />
          <span>{loading ? "Creating…" : "Create account"}</span>
        </button>
        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
        {info && <div className="text-sm opacity-80">{info}</div>}
      </form>

      <div className="text-sm opacity-80">
        Have an account? <Link className="underline" href="/login">Sign in</Link>
      </div>
    </div>
  );
}
