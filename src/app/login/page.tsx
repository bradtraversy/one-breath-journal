"use client";

import Link from "next/link";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/today");
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
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
          className="px-4 py-2 rounded-md bg-black text-white w-full dark:bg-white dark:text-black"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      </form>

      <div className="text-sm opacity-80">
        No account? <Link className="underline" href="/signup">Sign up</Link>
      </div>
    </div>
  );
}

