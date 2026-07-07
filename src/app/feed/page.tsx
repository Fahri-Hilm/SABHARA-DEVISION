import { AppShell } from "@/components/layout/AppShell";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { DutyFeed } from "@/components/feed/DutyFeed";
import { FeedFilter } from "@/components/feed/FeedFilter";
import { fetchDutyReports, fetchMemberRoster } from "@/lib/supabase/queries";
import { feedFilterSchema } from "@/lib/schemas/feed-filter";
import { requireMember } from "@/lib/auth/session";
import type { DutyReportStatus } from "@/types/db";

export const dynamic = "force-dynamic";

type SearchParams = {
  member_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
};

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filterParse = feedFilterSchema.safeParse({
    member_id: params.member_id,
    status: params.status as DutyReportStatus | undefined,
    date_from: params.date_from,
    date_to: params.date_to,
  });
  const filter = filterParse.success ? filterParse.data : {};

  let reports: Awaited<ReturnType<typeof fetchDutyReports>> = [];
  let roster: Awaited<ReturnType<typeof fetchMemberRoster>> = [];
  let fetchError: string | null = null;
  try {
    [reports, roster] = await Promise.all([
      fetchDutyReports(filter, 50),
      fetchMemberRoster(),
    ]);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Gagal memuat data";
  }
  const session = await requireMember();

  return (
    <AppShell>
      <main className="p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {fetchError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              Gagal memuat data: {fetchError}. Coba refresh.
            </div>
          )}
          <FeedFilter roster={roster} />
          <QueryProvider>
            <DutyFeed initialReports={reports} filter={filter} isAdmin={session?.role === "admin"} />
          </QueryProvider>
        </div>
      </main>
    </AppShell>
  );
}
