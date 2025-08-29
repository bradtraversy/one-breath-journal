import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapEntryRow(row: any) {
  return {
    id: row.id,
    date: row.entry_date,
    text: row.text,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
  };
}

export async function GET(_req: Request, { params }: { params: { date: string } }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const date = params.date;
  const { data, error } = await supabase
    .from("entries")
    .select("id, entry_date, text, started_at, submitted_at")
    .eq("user_id", user.id)
    .eq("entry_date", date)
    .single();
  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ entry: mapEntryRow(data) });
}

export async function DELETE(_req: Request, { params }: { params: { date: string } }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const date = params.date;
  const { error } = await supabase.from("entries").delete().eq("user_id", user.id).eq("entry_date", date);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

