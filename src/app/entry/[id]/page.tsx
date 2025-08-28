"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEntry, removeEntry } from "@/lib/local";
import { useParams, useRouter } from "next/navigation";

export default function EntryDetailPage() {
  const params = useParams();
  const date = Array.isArray(params?.id) ? params.id[0] : (params?.id as string); // Expect YYYY-MM-DD
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ startedAt?: string; submittedAt?: string } | null>(null);

  useEffect(() => {
    const entry = getEntry(date);
    if (entry) {
      setText(entry.text);
      setMeta({ startedAt: entry.startedAt, submittedAt: entry.submittedAt });
    } else {
      setText(null);
    }
    setLoading(false);
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Entry</h1>
        <Link href="/calendar" className="text-sm underline">Back to Calendar</Link>
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
                className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15 text-red-600 dark:text-red-400"
                onClick={() => {
                  if (!confirm("Delete this entry? This cannot be undone.")) return;
                  removeEntry(date);
                  router.push("/calendar");
                }}
              >
                Delete entry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
