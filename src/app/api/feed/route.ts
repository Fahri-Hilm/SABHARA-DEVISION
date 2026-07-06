import { NextRequest, NextResponse } from "next/server";
import { fetchDutyReports } from "@/lib/supabase/queries";
import { feedFilterSchema } from "@/lib/schemas/feed-filter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = feedFilterSchema.safeParse({
    member_id: searchParams.get("member_id") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    date_from: searchParams.get("date_from") ?? undefined,
    date_to: searchParams.get("date_to") ?? undefined,
  });

  if (!filter.success) {
    return NextResponse.json(
      { error: filter.error.issues[0]?.message ?? "Filter tidak valid" },
      { status: 400 },
    );
  }

  try {
    const reports = await fetchDutyReports(filter.data, 50);
    return NextResponse.json({ reports });
  } catch (e) {
    return NextResponse.json(
      { reports: [], error: e instanceof Error ? e.message : "Gagal memuat feed" },
      { status: 200 },
    );
  }
}
