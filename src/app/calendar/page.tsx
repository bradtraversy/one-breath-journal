import CalendarClient from "@/components/CalendarClient";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CalendarPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/calendar");

  return (
    <div className="space-y-6">
      <CalendarClient />
    </div>
  );
}
