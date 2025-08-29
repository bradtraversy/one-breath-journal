"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { hasEntry, todayKey } from "@/lib/local";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function monthInfo(year: number, month: number) {
  const first = new Date(year, month, 1);
  const firstDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function fmt(y: number, m: number, d: number) {
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

export default function CalendarClient() {
  const supabase = createSupabaseBrowserClient();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const today = todayKey();
  const { firstDay, daysInMonth } = useMemo(() => monthInfo(year, month), [year, month]);
  const [authed, setAuthed] = useState(false);
  const [serverDates, setServerDates] = useState<Set<string> | null>(null);

  const cells = useMemo(() => {
    const result: { dateStr: string; inMonth: boolean; day: number }[] = [];
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevDays = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevDays - i;
      result.push({ dateStr: fmt(prevYear, prevMonth, d), inMonth: false, day: d });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ dateStr: fmt(year, month, d), inMonth: true, day: d });
    }
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    while (result.length < 42) {
      const d = result.length - (firstDay + daysInMonth) + 1;
      result.push({ dateStr: fmt(nextYear, nextMonth, d), inMonth: false, day: d });
    }
    return result;
  }, [year, month, firstDay, daysInMonth]);

  const [, setTick] = useState(0);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const isAuthed = !!data.session;
      setAuthed(isAuthed);
      if (isAuthed) {
        // Fetch range for this month grid (includes leading/trailing days)
        const firstCell = cells[0]?.dateStr;
        const lastCell = cells[cells.length - 1]?.dateStr;
        if (firstCell && lastCell) {
          const res = await fetch(`/api/entries?from=${firstCell}&to=${lastCell}`, { cache: "no-store" });
          if (res.ok) {
            const payload = await res.json();
            setServerDates(new Set<string>(payload.entries.map((e: any) => e.date)));
          }
        }
      } else {
        setServerDates(null);
      }
    });
    const onFocus = () => setTick((n) => n + 1);
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("entry:") || e.key === "__ping__") setTick((n) => n + 1);
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, [year, month, firstDay, daysInMonth]);

  const monthLabel = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border border-black/10 dark:border-white/15"
            onClick={() => {
              const m = month - 1;
              if (m < 0) {
                setMonth(11);
                setYear((y) => y - 1);
              } else setMonth(m);
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
              if (m > 11) {
                setMonth(0);
                setYear((y) => y + 1);
              } else setMonth(m);
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
            const exists = authed ? serverDates?.has(dateStr) ?? false : hasEntry(dateStr);
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
    </>
  );
}
