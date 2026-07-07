import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemberAvatar } from "@/components/discord/MemberAvatar";
import { StatCard } from "@/app/admin/dashboard/_components/StatCard";
import {
  fetchMemberStats,
  fetchMemberDutyHistory,
} from "@/lib/supabase/member-stats";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { ArrowLeft, CalendarCheck, Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu ACC",
  approved: "Disetujui",
  rejected: "Ditolak",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calcDuration(onIso: string, offIso: string): string {
  const on = new Date(onIso).getTime();
  const off = new Date(offIso).getTime();
  const hours = (off - on) / (1000 * 60 * 60);
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}j${m}m` : `${h}j`;
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const admin = createAdminClient();
  const { data: memberRow, error: memberError } = await admin
    .from("members")
    .select("id, name, rank, badge_number, is_active, role, created_at")
    .eq("id", id)
    .maybeSingle();

  if (memberError || !memberRow) {
    notFound();
  }

  const member = memberRow as {
    id: string;
    name: string;
    rank: string | null;
    badge_number: string | null;
    is_active: boolean;
    role: string;
    created_at: string;
  };

  const [stats, history] = await Promise.all([
    fetchMemberStats(id),
    fetchMemberDutyHistory(id, 100),
  ]);

  const memberStats = stats ?? {
    total_duty: 0,
    total_hours: 0,
    weekly_duty: 0,
    weekly_hours: 0,
    last_duty: null,
    first_duty: null,
    approved_count: 0,
    pending_count: 0,
    rejected_count: 0,
  };

  return (
    <AppShell>
      <main className="p-4 lg:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/admin/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="font-display text-2xl font-bold">Detail Anggota</h1>
        </div>

        <div className="glass gradient-border mb-6 flex items-center gap-4 rounded-xl p-5">
          <MemberAvatar name={member.name} rank={member.rank} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold">{member.name}</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {member.rank && <span>{member.rank}</span>}
              {member.badge_number && (
                <span className="font-mono text-xs">{member.badge_number}</span>
              )}
              <Badge variant={member.is_active ? "default" : "destructive"}>
                {member.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">
              Bergabung: {formatDate(member.created_at)}
              {memberStats.last_duty && (
                <> • Terakhir duty: {formatDate(memberStats.last_duty)}</>
              )}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Duty"
            value={memberStats.total_duty}
            icon={CalendarCheck}
          />
          <StatCard
            label="Total Jam Duty"
            value={`${memberStats.total_hours}j`}
            icon={Clock}
          />
          <StatCard
            label="Duty Minggu Ini"
            value={memberStats.weekly_duty}
            icon={CheckCircle2}
            variant={memberStats.weekly_duty > 0 ? "default" : "warning"}
          />
          <StatCard
            label="Jam Minggu Ini"
            value={`${memberStats.weekly_hours}j`}
            icon={Clock}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="glass rounded-lg border border-success/20 p-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Disetujui</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-success">
              {memberStats.approved_count}
            </p>
          </div>
          <div className="glass rounded-lg border border-warning/20 p-4">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Pending</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-warning">
              {memberStats.pending_count}
            </p>
          </div>
          <div className="glass rounded-lg border border-destructive/20 p-4">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Ditolak</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-destructive">
              {memberStats.rejected_count}
            </p>
          </div>
        </div>

        <section className="glass mt-6 rounded-xl border border-border/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Riwayat Duty</h2>
            <span className="font-mono text-xs text-muted-foreground">
              {history.length} laporan
            </span>
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <CalendarCheck className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
              Belum ada riwayat duty
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Tanggal</th>
                    <th className="px-3 py-2 font-medium">On Duty</th>
                    <th className="px-3 py-2 font-medium">Off Duty</th>
                    <th className="px-3 py-2 font-medium">Durasi</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr
                      key={h.id}
                      className="border-b border-border/40 transition-colors last:border-0 hover:bg-secondary/30"
                    >
                      <td className="px-3 py-3 font-mono text-xs">{h.duty_date}</td>
                      <td className="px-3 py-3 font-mono text-xs text-cyan">
                        {formatDateTime(h.on_duty_at)}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-cyan">
                        {formatDateTime(h.off_duty_at)}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs">
                        {calcDuration(h.on_duty_at, h.off_duty_at)}
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={STATUS_VARIANT[h.status]}>
                          {STATUS_LABEL[h.status]}
                        </Badge>
                      </td>
                      <td className="max-w-xs px-3 py-3 text-xs text-muted-foreground">
                        {h.notes ? (
                          <span className="line-clamp-2">{h.notes}</span>
                        ) : (
                          <span className="text-muted-foreground/50">-</span>
                        )}
                        {h.status === "rejected" && h.reject_reason && (
                          <span className="mt-1 block text-destructive">
                            Alasan: {h.reject_reason}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}
