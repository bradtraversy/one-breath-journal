"use client";

import { getEntry, listEntryDates } from "@/lib/local";

export default function SettingsPage() {
  const handleExport = () => {
    const dates = listEntryDates();
    const items = dates.map((date) => ({ date, ...getEntry(date)! }));
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), entries: items }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
    a.href = url;
    a.download = `one-breath-entries-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Timezone (placeholder)</label>
          <select className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 p-2">
            <option>Detect from browser</option>
            <option>UTC</option>
          </select>
        </div>
        <button className="px-4 py-2 rounded-md bg-black text-white w-fit dark:bg-white dark:text-black">Save (placeholder)</button>
      </div>

      <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 space-y-3">
        <h2 className="text-sm font-medium">Data</h2>
        <p className="text-sm opacity-70">Export your locally saved entries as JSON.</p>
        <button onClick={handleExport} className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15 w-fit">
          Export entries (JSON)
        </button>
      </div>

      <p className="text-sm opacity-70">Account and privacy controls will be added here.</p>
    </div>
  );
}
