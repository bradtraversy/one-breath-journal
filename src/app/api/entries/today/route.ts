import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toDateInTz } from "@/lib/dates";
import { mapEntryRow, type DBEntryRow } from "@/lib/api";

// toDateInTz moved to src/lib/dates

// mapEntryRow and DBEntryRow are shared in src/lib/api

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const tz = profile?.timezone || "UTC";
  const today = toDateInTz(new Date(), tz);
  const { data } = await supabase
    .from("entries")
    .select("id, entry_date, text, started_at, submitted_at")
    .eq("user_id", user.id)
    .eq("entry_date", today)
    .maybeSingle();
  if (!data) return NextResponse.json({ exists: false });
  return NextResponse.json({ exists: true, entry: mapEntryRow(data as DBEntryRow) });
}
