import { NextRequest, NextResponse } from "next/server";
import { runExportAndCleanup } from "@/lib/mutations/export-cleanup-actions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runExportAndCleanup();
    return NextResponse.json({
      success: true,
      exported: result.exported,
      deleted: result.deleted,
      csv_path: result.csvPath,
      errors: result.errors,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Export+cleanup failed" },
      { status: 500 },
    );
  }
}
