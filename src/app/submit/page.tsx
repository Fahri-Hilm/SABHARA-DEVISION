import { AppShell } from "@/components/layout/AppShell";
import { fetchMemberRoster } from "@/lib/supabase/queries";
import { DutyForm } from "./_components/DutyForm";
import { requireMember } from "@/lib/auth/session";
import type { Member } from "@/types/db";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  await requireMember();
  const roster = await fetchMemberRoster();
  const members: Member[] = roster;

  return (
    <AppShell>
      <main className="p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Laporan Duty</h1>
            <p className="text-sm text-muted-foreground">
              Isi form laporan duty dibawah ini. Foto bukti akan dikompres otomatis.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/80 p-6">
            <DutyForm roster={members} />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
