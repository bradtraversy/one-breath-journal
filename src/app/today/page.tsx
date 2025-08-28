"use client";

import { useEffect, useRef, useState } from "react";

export default function TodayPage() {
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [text, setText] = useState("");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(intervalRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [started]);

  const reset = () => {
    setStarted(false);
    setSecondsLeft(60);
    setText("");
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

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
        <div className="flex gap-2 justify-center">
          {!started && secondsLeft === 60 && (
            <button
              className="px-4 py-2 rounded-md bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              onClick={() => setStarted(true)}
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
        <textarea
          className="w-full h-48 resize-y rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 p-3 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          placeholder="Breathe in… and write what’s present."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!started || secondsLeft === 0}
        />
        <div className="flex items-center justify-between text-sm">
          <div className="opacity-70">{text.trim().length} chars</div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15"
              onClick={reset}
            >
              Clear
            </button>
            <button
              className="px-3 py-1.5 rounded-md bg-black text-white disabled:bg-black/30 dark:bg-white dark:text-black disabled:dark:bg-white/30"
              disabled={!started || secondsLeft === 0}
            >
              Submit (placeholder)
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm opacity-70">
        Basic layout only. Auth, persistence, and calendar logic come next.
      </p>
    </div>
  );
}

