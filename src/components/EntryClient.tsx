"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEntry, removeEntry } from "@/lib/local";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function EntryClient({ date }: { date: string }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ startedAt?: string; submittedAt?: string } | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const isAuthed = !!data.session;
      setAuthed(isAuthed);
      if (isAuthed) {
        const res = await fetch(`/api/entries/${date}`);
        if (res.ok) {
          const payload = await res.json();
          setText(payload.entry.text);
          setMeta({ startedAt: payload.entry.startedAt, submittedAt: payload.entry.submittedAt });
        } else {
          setText(null);
        }
      } else {
        const entry = getEntry(date);
        if (entry) {
          setText(entry.text);
          setMeta({ startedAt: entry.startedAt, submittedAt: entry.submittedAt });
        } else {
          setText(null);
        }
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Entry</h1>
        <Link href="/calendar" className="text-sm underline inline-flex items-center gap-1">
          <Icon name="arrow-left" className="w-4 h-4" />
          Back to Calendar
        </Link>
      </div>
      <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 space-y-3">
        <div className="text-sm opacity-70">Date: {date}</div>
        {loading ? (
          <div className="opacity-70 text-sm">Loading…</div>
        ) : text === null ? (
          <div className="opacity-70 text-sm">No entry found for this day.</div>
        ) : (
          <>
            <article className="whitespace-pre-wrap leading-relaxed">{text}</article>
            {meta?.submittedAt && (
              <div className="text-xs opacity-60">
                Submitted at {new Date(meta.submittedAt).toLocaleString()} {meta?.startedAt ? `· Started ${new Date(meta.startedAt).toLocaleTimeString()}` : ""}
              </div>
            )}
            <div className="pt-2">
              <button
                className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15 text-red-600 dark:text-red-400 inline-flex items-center gap-2"
                onClick={() => {
                  if (!confirm("Delete this entry? This cannot be undone.")) return;
                  if (authed) {
                    fetch(`/api/entries/${date}`, { method: "DELETE" }).then(() => router.push("/calendar"));
                  } else {
                    removeEntry(date);
                    router.push("/calendar");
                  }
                }}
              >
                <Icon name="trash" className="w-4 h-4" />
                <span>Delete entry</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
