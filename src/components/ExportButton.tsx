"use client";

import { getEntry, listEntryDates } from "@/lib/local";
import Icon from "./Icon";

export default function ExportButton() {
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
    <button onClick={handleExport} className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15 w-fit inline-flex items-center gap-2">
      <Icon name="download" className="w-4 h-4" />
      <span>Export entries (JSON)</span>
    </button>
  );
}
