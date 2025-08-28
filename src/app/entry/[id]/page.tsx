type Props = { params: { id: string } };

export default function EntryDetailPage({ params }: Props) {
  const { id } = params;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Entry</h1>
      <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 space-y-3">
        <div className="text-sm opacity-70">Entry ID: {id}</div>
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <p>Read-only view of an entry will appear here once persistence is added.</p>
        </article>
      </div>
    </div>
  );
}

