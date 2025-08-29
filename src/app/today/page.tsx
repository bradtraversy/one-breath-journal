import StreakBadge from "@/components/StreakBadge";
import TimerEditor from "@/components/TimerEditor";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TodayPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/today");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <StreakBadge />
      </div>

      <TimerEditor />

      <p className="text-sm opacity-70">
        Draft auto-saves locally. On submit or timeout, today’s entry locks.
      </p>
    </div>
  );
}
