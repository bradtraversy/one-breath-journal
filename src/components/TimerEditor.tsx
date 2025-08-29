"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { listEntryDates, todayKey } from "@/lib/local";
import Icon from "./Icon";

type StoredEntry = {
  text: string;
  startedAt: string; // ISO
  submittedAt: string; // ISO
};

export default function TimerEditor() {
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [text, setText] = useState("");
  const [locked, setLocked] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const today = todayKey();
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
  }, []);

  // Save draft as user types (when not locked)
  useEffect(() => {
    if (locked) return;
    try {
      window.localStorage.setItem(draftKey, text);
    } catch {}
  }, [text, locked, draftKey]);

  // Timer
  useEffect(() => {
    if (!started || locked) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(intervalRef.current!);
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
    // light ping so others tabs can update if needed
    try {
      window.localStorage.setItem("__ping__", String(Date.now()));
      window.localStorage.removeItem("__ping__");
    } catch {}
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 space-y-4">
      <div className="text-center text-4xl font-mono tabular-nums" aria-live="polite">
        {mm}:{ss}
      </div>
      {!locked ? (
        <div className="flex gap-2 justify-center">
          {!started && (
            <button
              className="px-4 py-2 rounded-md bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 inline-flex items-center gap-2"
              onClick={start}
            >
              <Icon name="play" className="w-4 h-4" />
              <span>Start 60s</span>
            </button>
          )}
          {started && (
            <button
              className="px-4 py-2 rounded-md border border-black/10 dark:border-white/15 inline-flex items-center gap-2"
              onClick={reset}
            >
              <Icon name="rotate" className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>
      ) : (
        <div className="text-center text-sm opacity-80 flex flex-col items-center gap-2">
          <div>Locked for today. Come back tomorrow.</div>
          <Link
            href={`/entry/${today}`}
            className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15 inline-flex items-center gap-2"
          >
            <Icon name="file" className="w-4 h-4" />
            <span>View today’s entry</span>
          </Link>
        </div>
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
              className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15 inline-flex items-center gap-2"
              onClick={clearDraft}
            >
              <Icon name="x" className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
          {!locked && (
            <button
              className="px-3 py-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black inline-flex items-center gap-2"
              onClick={doSubmit}
              disabled={!started}
            >
              <Icon name="check" className="w-4 h-4" />
              <span>Submit</span>
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
  );
}
