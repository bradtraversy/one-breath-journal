export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
      <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6">
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="font-medium opacity-70">{d}</div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-md border border-black/10 dark:border-white/15 flex items-center justify-center text-xs"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm opacity-70">Entries will appear as dots. Click a day to view.</p>
    </div>
  );
}

