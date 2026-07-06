import { AppShell } from "@/components/layout/AppShell";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { DutyFeed } from "@/components/feed/DutyFeed";
import { FeedFilter } from "@/components/feed/FeedFilter";
import { fetchDutyReports, fetchMemberRoster } from "@/lib/supabase/queries";
import { feedFilterSchema } from "@/lib/schemas/feed-filter";
import { getSession } from "@/lib/auth/session";
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

  const [reports, roster, session] = await Promise.all([
    fetchDutyReports(filter, 50),
    fetchMemberRoster(),
    getSession(),
  ]);

  return (
    <AppShell>
      <main className="p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <FeedFilter roster={roster} />
          <QueryProvider>
            <DutyFeed initialReports={reports} filter={filter} isAdmin={session?.role === "admin"} />
          </QueryProvider>
        </div>
      </main>
    </AppShell>
  );
}
