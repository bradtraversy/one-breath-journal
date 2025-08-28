"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { hasEntry, todayKey } from "@/lib/local";

function monthInfo(year: number, month: number) {
  // month: 0-11
  const first = new Date(year, month, 1);
  const firstDay = first.getDay(); // 0 Sun - 6 Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function fmt(y: number, m: number, d: number) {
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-based

  const today = todayKey();
  const { firstDay, daysInMonth } = useMemo(() => monthInfo(year, month), [year, month]);

  // Build 6x7 grid including prev/next month spillover
  const cells = useMemo(() => {
    const result: { dateStr: string; inMonth: boolean; day: number }[] = [];
    // Days from prev month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevDays = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevDays - i;
      result.push({ dateStr: fmt(prevYear, prevMonth, d), inMonth: false, day: d });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ dateStr: fmt(year, month, d), inMonth: true, day: d });
    }
    // Next month to fill 42 cells
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    while (result.length < 42) {
      const d = result.length - (firstDay + daysInMonth) + 1;
      result.push({ dateStr: fmt(nextYear, nextMonth, d), inMonth: false, day: d });
    }
    return result;
  }, [year, month, firstDay, daysInMonth]);

  // Trigger re-render when localStorage changes (simple approach: rely on navigation or refresh)
  const [, setTick] = useState(0);
  useEffect(() => {
    const onFocus = () => setTick((n) => n + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const monthLabel = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border border-black/10 dark:border-white/15"
            onClick={() => {
              const m = month - 1;
              setMonth(m < 0 ? 11 : m);
              if (m < 0) setYear((y) => y - 1);
            }}
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="text-sm opacity-80 w-40 text-center">{monthLabel}</div>
          <button
            className="px-2 py-1 rounded border border-black/10 dark:border-white/15"
            onClick={() => {
              const m = month + 1;
              setMonth(m > 11 ? 0 : m);
              if (m > 11) setYear((y) => y + 1);
            }}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6">
        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="font-medium opacity-70">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {cells.map(({ dateStr, inMonth, day }) => {
            const isToday = dateStr === today;
            const exists = hasEntry(dateStr);
            const base = "aspect-square rounded-md border flex items-center justify-center relative";
            const border = "border-black/10 dark:border-white/15";
            const muted = inMonth ? "" : "opacity-40";
            const ring = isToday ? "ring-2 ring-black/20 dark:ring-white/20" : "";
            return (
              <div key={dateStr} className={`${base} ${border} ${muted} ${ring}`}>
                {exists ? (
                  <Link href={`/entry/${dateStr}`} className="absolute inset-0" aria-label={`Open entry for ${dateStr}`}></Link>
                ) : null}
                <span className="pointer-events-none">{day}</span>
                {exists && (
                  <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-sm opacity-70">Filled days have a dot. Click to view the entry.</p>
    </div>
  );
}
