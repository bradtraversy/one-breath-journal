// Client-only localStorage helpers for entries keyed by local date
// Key format: entry:YYYY-MM-DD

export type LocalEntry = {
  text: string;
  startedAt: string; // ISO
  submittedAt: string; // ISO
};

function storageAvailable() {
  try {
    const k = "__ls_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function entryKey(date: string) {
  return `entry:${date}`;
}

export function getEntry(date: string): LocalEntry | null {
  if (typeof window === "undefined" || !storageAvailable()) return null;
  const raw = window.localStorage.getItem(entryKey(date));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalEntry;
  } catch {
    return null;
  }
}

export function setEntry(date: string, entry: LocalEntry) {
  if (typeof window === "undefined" || !storageAvailable()) return;
  window.localStorage.setItem(entryKey(date), JSON.stringify(entry));
}

export function removeEntry(date: string) {
  if (typeof window === "undefined" || !storageAvailable()) return;
  window.localStorage.removeItem(entryKey(date));
}

export function listEntryDates(): string[] {
  if (typeof window === "undefined" || !storageAvailable()) return [];
  const dates: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith("entry:")) {
      dates.push(k.slice(6));
    }
  }
  return dates.sort();
}

export function hasEntry(date: string): boolean {
  if (typeof window === "undefined" || !storageAvailable()) return false;
  return window.localStorage.getItem(entryKey(date)) !== null;
}

export function todayKey(d = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function computeStreaks(dates: string[], today = todayKey()): { current: number; best: number } {
  // dates are YYYY-MM-DD; compute consecutive days streaks ending at today
  const set = new Set(dates);

  // Helper to shift date by n days
  const shift = (dateStr: string, delta: number) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + delta);
    return todayKey(dt);
  };

  // Current streak
  let current = 0;
  let cursor = today;
  while (set.has(cursor)) {
    current += 1;
    cursor = shift(cursor, -1);
  }

  // Best streak: scan all dates
  const sorted = [...set].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const dt of sorted) {
    if (!prev) {
      run = 1;
    } else if (dt === shift(prev, 1)) {
      run += 1;
    } else {
      best = Math.max(best, run);
      run = 1;
    }
    prev = dt;
  }
  best = Math.max(best, run);

  return { current, best };
}

