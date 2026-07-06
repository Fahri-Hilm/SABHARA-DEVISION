import { NextRequest, NextResponse } from "next/server";
import { runCleanup } from "@/lib/mutations/cleanup-actions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runCleanup();
    return NextResponse.json({
      success: true,
      cleaned: result.cleaned,
      photos: result.photos.length,
      errors: result.errors,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Cleanup failed" },
      { status: 500 },
    );
  }
}
