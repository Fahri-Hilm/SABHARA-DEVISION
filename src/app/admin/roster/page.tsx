import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchMemberRoster } from "@/lib/supabase/queries";
import { AddMemberButton } from "./_components/AddMemberButton";
import { MemberActions } from "./_components/MemberActions";
import { requireAdmin } from "@/lib/auth/session";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RosterPage() {
  await requireAdmin();
  const members = await fetchMemberRoster();

  return (
    <AppShell>
      <main className="p-4 lg:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/admin/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="font-display text-2xl font-bold">Roster Anggota</h1>
          <div className="ml-auto">
            <AddMemberButton />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Pangkat</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Badge</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Belum ada anggota. Tambah anggota baru.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="border-b border-border/40 last:border-0">
                    <td className="px-4 py-3 font-medium">{m.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.rank ?? "-"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {m.badge_number ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                        {m.role === "admin" ? "Admin" : "Anggota"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={m.is_active ? "default" : "destructive"}>
                        {m.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <MemberActions member={m} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </AppShell>
  );
}
