"use client";

import { useEffect, useState } from "react";
import { computeStreaks, listEntryDates, todayKey } from "@/lib/local";

export default function StreakBadge() {
  const [streaks, setStreaks] = useState<{ current: number; best: number }>({ current: 0, best: 0 });
  const today = todayKey();

  useEffect(() => {
    const update = () => {
      const dates = listEntryDates();
      setStreaks(computeStreaks(dates, today));
    };
    update();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("entry:") || e.key === "__ping__") update();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [today]);

  return (
    <div className="text-sm opacity-75">Current streak: {streaks.current || "—"} | Best: {streaks.best || "—"}</div>
  );
}

