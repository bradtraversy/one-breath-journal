import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DBEntryRow = {
  id: string;
  entry_date: string;
  text: string;
  started_at: string;
  submitted_at: string;
};

function mapEntryRow(row: DBEntryRow) {
  return {
    id: row.id,
    date: row.entry_date,
    text: row.text,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase
    .from("entries")
    .select("id, entry_date, text, started_at, submitted_at")
    .eq("user_id", user.id)
    .eq("entry_date", date)
    .single();
  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ entry: mapEntryRow(data) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { error } = await supabase.from("entries").delete().eq("user_id", user.id).eq("entry_date", date);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
