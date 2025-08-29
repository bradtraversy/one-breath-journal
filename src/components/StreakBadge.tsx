"use client";

import { useEffect, useState } from "react";
import { computeStreaks, listEntryDates, todayKey } from "@/lib/local";

export default function StreakBadge() {
  const [streaks, setStreaks] = useState<{ current: number; best: number }>({ current: 0, best: 0 });
  const today = todayKey();
  type ApiEntry = { date: string; text: string; startedAt: string; submittedAt: string; id?: string };
  type ApiListResponse = { entries: ApiEntry[] };

  useEffect(() => {
    const updateLocal = () => {
      const dates = listEntryDates();
      setStreaks(computeStreaks(dates, today));
    };
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const res = await fetch(`/api/entries`, { cache: "no-store" });
      if (res.ok) {
        const payload = (await res.json()) as ApiListResponse;
        const dates: string[] = payload.entries.map((e) => e.date);
        setStreaks(computeStreaks(dates, today));
        return;
      }
      updateLocal();
    })();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("entry:") || e.key === "__ping__") updateLocal();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, [today]);

  return (
    <div className="text-sm opacity-75">Current streak: {streaks.current || "—"} | Best: {streaks.best || "—"}</div>
  );
}
