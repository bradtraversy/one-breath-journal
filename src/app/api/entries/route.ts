import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toDateInTz } from "@/lib/dates";
import { mapEntryRow, type DBEntryRow } from "@/lib/api";

// mapEntryRow and DBEntryRow are shared in src/lib/api

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let query = supabase.from("entries").select("id, entry_date, text, started_at, submitted_at").eq("user_id", user.id).order("entry_date", { ascending: false });
  if (from) query = query.gte("entry_date", from);
  if (to) query = query.lte("entry_date", to);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: ((data ?? []) as DBEntryRow[]).map(mapEntryRow) });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const text: string = (body as { text?: string })?.text ?? "";
  const startedAt: string | undefined = (body as { startedAt?: string })?.startedAt;
  if (typeof text !== "string") return NextResponse.json({ error: "text must be a string" }, { status: 422 });

  // Fetch timezone from profile
  const { data: profile } = await supabase.from("profiles").select("timezone").eq("id", user.id).single();
  const tz = profile?.timezone || "UTC";
  const submitted = new Date();
  const entryDate = toDateInTz(submitted, tz);

  const insert = {
    user_id: user.id,
    entry_date: entryDate,
    text,
    started_at: startedAt ?? submitted.toISOString(),
    submitted_at: submitted.toISOString(),
    source: "web",
  } as const;

  const { data, error, status } = await supabase.from("entries").insert(insert).select("id, entry_date, text, started_at, submitted_at").single();
  if (error) {
    if (status === 409 || /duplicate key/i.test(error.message)) {
      return NextResponse.json({ error: "Entry already exists for today" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ entry: mapEntryRow(data as DBEntryRow) }, { status: 201 });
}
