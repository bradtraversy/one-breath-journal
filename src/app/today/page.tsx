"use client";

import { useEffect, useRef, useState } from "react";

type StoredEntry = {
  text: string;
  startedAt: string; // ISO
  submittedAt: string; // ISO
};

function localDateKey(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function TodayPage() {
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [text, setText] = useState("");
  const [locked, setLocked] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const today = localDateKey();
  const draftKey = `draft:${today}`;
  const entryKey = `entry:${today}`;

  // Load draft/entry on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(entryKey);
      if (stored) {
        const entry: StoredEntry = JSON.parse(stored);
        setText(entry.text);
        setStartedAt(entry.startedAt);
        setSubmittedAt(entry.submittedAt);
        setLocked(true);
        return;
      }
      const draft = window.localStorage.getItem(draftKey);
      if (draft) setText(draft);
    } catch {
      // ignore storage errors
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save draft as user types (when not locked)
  useEffect(() => {
    if (locked) return;
    try {
      window.localStorage.setItem(draftKey, text);
    } catch {
      // ignore
    }
  }, [text, locked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (!started || locked) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(intervalRef.current!);
          // Auto-submit on timeout
          doSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [started, locked]);

  const start = () => {
    if (locked) return;
    setStarted(true);
    if (!startedAt) setStartedAt(new Date().toISOString());
  };

  const reset = () => {
    if (locked) return;
    setStarted(false);
    setSecondsLeft(60);
  };

  const clearDraft = () => {
    if (locked) return;
    setText("");
    try {
      window.localStorage.removeItem(draftKey);
    } catch {}
  };

  const doSubmit = () => {
    if (locked) return;
    const submitted = new Date().toISOString();
    const entry: StoredEntry = {
      text,
      startedAt: startedAt ?? new Date().toISOString(),
      submittedAt: submitted,
    };
    try {
      window.localStorage.setItem(entryKey, JSON.stringify(entry));
      window.localStorage.removeItem(draftKey);
    } catch {}
    setSubmittedAt(submitted);
    setLocked(true);
    setStarted(false);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <div className="text-sm opacity-75">Current streak: — | Best: —</div>
      </div>

      <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 space-y-4">
        <div className="text-center text-4xl font-mono tabular-nums" aria-live="polite">
          {mm}:{ss}
        </div>
        {!locked ? (
          <div className="flex gap-2 justify-center">
            {!started && (
              <button
                className="px-4 py-2 rounded-md bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
                onClick={start}
              >
                Start 60s
              </button>
            )}
            {started && (
              <button
                className="px-4 py-2 rounded-md border border-black/10 dark:border-white/15"
                onClick={reset}
              >
                Reset
              </button>
            )}
          </div>
        ) : (
          <div className="text-center text-sm opacity-80">Locked for today. Come back tomorrow.</div>
        )}
        <textarea
          className="w-full h-48 resize-y rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 p-3 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          placeholder="Breathe in… and write what’s present."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!started || locked}
        />
        <div className="flex items-center justify-between text-sm">
          <div className="opacity-70">{wordCount} words · {text.trim().length} chars</div>
          <div className="flex gap-2">
            {!locked && (
              <button
                className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15"
                onClick={clearDraft}
              >
                Clear
              </button>
            )}
            {!locked && (
              <button
                className="px-3 py-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black"
                onClick={doSubmit}
                disabled={!started}
              >
                Submit
              </button>
            )}
          </div>
        </div>
        {locked && submittedAt && (
          <div className="text-xs opacity-70">
            Submitted at {new Date(submittedAt).toLocaleTimeString()} · Started {startedAt ? new Date(startedAt).toLocaleTimeString() : "—"}
          </div>
        )}
      </div>

      <p className="text-sm opacity-70">
        Draft auto-saves locally. On submit or timeout, today’s entry locks.
      </p>
    </div>
  );
}
