import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toDateInTz(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

function mapEntryRow(row: any) {
  return {
    id: row.id,
    date: row.entry_date,
    text: row.text,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
  };
}

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
  return NextResponse.json({ exists: true, entry: mapEntryRow(data) });
}

