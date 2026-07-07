import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { TopNav } from "@/components/portal/TopNav";
import { LeftPanel } from "@/components/portal/LeftPanel";
import { CenterBadge } from "@/components/portal/CenterBadge";
import { RightPanel } from "@/components/portal/RightPanel";
import { TerminalPanel } from "@/components/portal/TerminalPanel";
import { fetchDutyStats } from "@/lib/supabase/stats";
import { fetchMembersWithStats } from "@/lib/supabase/member-stats";
import { getSession } from "@/lib/auth/session";
import { ShieldCheck, Radio } from "lucide-react";

export default async function Home() {
  const session = await getSession();
  const isAdmin = session?.role === "admin";

  let stats = null;
  let members = null;

  if (session) {
    try {
      [stats, members] = await Promise.all([
        fetchDutyStats(),
        fetchMembersWithStats(),
      ]);
    } catch {
    }
  }

  if (!session) {
    return (
      <div className="bg-grid min-h-screen flex flex-col relative">
        <div className="text-center mt-16 mb-4 z-10 relative px-4">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.15em] text-cyan-100 glow-text">
            KEPOLISIAN FUTURISTIC
          </h1>
          <p className="font-display text-sm sm:text-base tracking-[0.3em] text-cyan-400 mt-1">
            SABHARA DEVISION
          </p>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 px-4 py-8 relative z-10">
          <CenterBadge />
        </div>

        <TerminalPanel />

        <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8 z-10 relative px-4">
          <Link
            href="/login"
            className="glow-border bg-panel-bg backdrop-blur-md rounded-lg px-6 py-3 flex items-center gap-2 text-cyan-200 text-sm font-semibold tracking-wider hover:bg-cyan-900/30 transition-all"
          >
            <ShieldCheck size={16} />
            LOGIN
          </Link>
        </div>

        <div className="fixed bottom-4 left-4 z-10 font-mono text-[10px] text-cyan-500/50 tracking-widest">
          <div>SABHARA SYSTEM v1.0.0</div>
          <div>KEPOLISIAN FUTURISTIC DIVISION</div>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="bg-grid min-h-screen flex flex-col relative">
        {isAdmin && <TopNav />}

        <div className="text-center mt-8 mb-4 z-10 relative px-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.15em] text-cyan-100 glow-text">
            KEPOLISIAN FUTURISTIC
          </h1>
          <p className="font-display text-sm sm:text-base tracking-[0.3em] text-cyan-400 mt-1">
            SABHARA DEVISION
          </p>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 px-4 py-8 relative z-10">
          {stats && <LeftPanel stats={stats} />}
          <CenterBadge />
          {members && <RightPanel members={members} />}
        </div>

        <TerminalPanel />

        <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8 z-10 relative px-4">
          <Link
            href="/feed"
            className="glow-border bg-panel-bg backdrop-blur-md rounded-lg px-6 py-3 flex items-center gap-2 text-cyan-200 text-sm font-semibold tracking-wider hover:bg-cyan-900/30 transition-all"
          >
            <Radio size={16} />
            DUTY REPORTS
          </Link>
        </div>

        <div className="fixed bottom-20 lg:bottom-4 left-4 z-10 font-mono text-[10px] text-cyan-500/50 tracking-widest">
          <div>SABHARA SYSTEM v1.0.0</div>
          <div>KEPOLISIAN FUTURISTIC DIVISION</div>
        </div>
      </div>
    </AppShell>
  );
}
