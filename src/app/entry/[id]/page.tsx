import EntryClient from "@/components/EntryClient";

function isValidDateId(id: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(id)) return false;
  const [y, m, d] = id.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export default function EntryDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!isValidDateId(id)) {
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6">
        <div className="text-sm opacity-70">Invalid date format. Use YYYY-MM-DD.</div>
      </div>
    );
  }
  return <EntryClient date={id} />;
}
