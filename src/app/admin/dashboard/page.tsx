import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "./_components/StatCard";
import { TopMembersList } from "./_components/TopMembersList";
import { ManualCleanupButton } from "./_components/ManualCleanupButton";
import { fetchDutyStats } from "@/lib/supabase/stats";
import { requireAdmin } from "@/lib/auth/session";
import { CalendarCheck, Clock, AlertTriangle, CheckCircle2, Users, ListChecks, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAdmin();
  const stats = await fetchDutyStats();

  return (
    <AppShell>
      <main className="p-4 lg:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <h1 className="font-display text-2xl font-bold">Dashboard Admin</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Duty Minggu Ini"
            value={stats.weekly_total}
            icon={CalendarCheck}
          />
          <StatCard
            label="Total Jam Duty"
            value={`${stats.total_hours}j`}
            icon={Clock}
          />
          <StatCard
            label="Pending ACC"
            value={stats.pending_count}
            icon={CheckCircle2}
            variant={stats.pending_count > 0 ? "warning" : "default"}
          />
          <StatCard
            label="Belum Duty 3+ Hari"
            value={stats.missed_count}
            icon={AlertTriangle}
            variant={stats.missed_count > 0 ? "destructive" : "default"}
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-border/60 bg-card/80 p-4">
            <h2 className="mb-4 font-display text-lg font-semibold">Top Anggota Minggu Ini</h2>
            <TopMembersList members={stats.top_members} />
          </section>

          <section className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-card/80 p-4">
              <h2 className="mb-3 font-display text-lg font-semibold">Status Laporan</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disetujui</span>
                  <span className="font-mono text-success">{stats.approved_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Menunggu ACC</span>
                  <span className="font-mono text-warning">{stats.pending_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ditolak</span>
                  <span className="font-mono text-destructive">{stats.rejected_count}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-card/80 p-4">
              <h2 className="mb-3 font-display text-lg font-semibold">Maintenance</h2>
              <ManualCleanupButton />
            </div>

            <div className="flex gap-2">
              <Link href="/admin/roster" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                <Users className="h-4 w-4" />
                Kelola Roster
              </Link>
              <Link href="/feed" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                <ListChecks className="h-4 w-4" />
                Lihat Feed
              </Link>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
