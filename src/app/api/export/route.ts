import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapRow(row: any) {
  return {
    date: row.entry_date as string,
    text: row.text as string,
    startedAt: row.started_at as string,
    submittedAt: row.submitted_at as string,
  };
}

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("entries")
    .select("entry_date, text, started_at, submitted_at")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const payload = {
    exportedAt: new Date().toISOString(),
    entries: (data ?? []).map(mapRow),
  };

  const body = JSON.stringify(payload, null, 2);
  const stamp = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=one-breath-entries-${stamp}.json`,
      "Cache-Control": "no-store",
    },
  });
}

