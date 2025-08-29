"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";

export default function SignupClient() {
  const router = useRouter();
  const search = useSearchParams();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const nextUrl = search?.get("next") || "/today";

  // If already signed in, go to Today immediately
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/today");
    });
  }, [router, supabase.auth]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      return;
    }
    const base = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : undefined);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: base },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      if (data?.session) {
        router.push(nextUrl);
      } else {
        setInfo("Account created. Check your email to confirm, then sign in.");
      }
    }
  };

  const signInWithGoogle = async () => {
    const base = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : undefined);
    const redirectTo = base ? `${base}/auth/callback?next=${encodeURIComponent(nextUrl)}` : undefined;
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
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
          autoComplete="email"
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <input
          type="password"
          required
          placeholder="Confirm password"
          className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 p-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
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

      <div className="flex items-center gap-3 my-2">
        <div className="h-px bg-black/10 dark:bg-white/15 flex-1" />
        <span className="text-xs opacity-60">or</span>
        <div className="h-px bg-black/10 dark:bg-white/15 flex-1" />
      </div>
      <button
        onClick={signInWithGoogle}
        className="px-4 py-2 rounded-md border border-black/10 dark:border-white/15 w-full inline-flex items-center justify-center gap-2"
      >
        <Image src="/google.svg" alt="Google" width={18} height={18} />
        <span>Continue with Google</span>
      </button>

      <div className="text-sm opacity-80">
        Have an account? <Link className="underline" href="/login">Sign in</Link>
      </div>
    </div>
  );
}
