"use client";

import { Zap, MapPin, Moon, CheckCircle2 } from "lucide-react";
import type { MemberWithStats } from "@/lib/supabase/member-stats";

type RightPanelProps = {
  members: MemberWithStats[];
};

function getOfficerActivity(m: MemberWithStats) {
  if (m.stats.weekly_duty === 0) {
    return { status: "[BREAK]", color: "text-red-400", icon: Moon };
  }
  if (m.stats.weekly_duty >= 3) {
    return { status: "[ONLINE]", color: "text-green-400", icon: Zap };
  }
  return { status: "[PATROLLING]", color: "text-cyan-400", icon: MapPin };
}

export function RightPanel({ members }: RightPanelProps) {
  const officers = members.slice(0, 4);

  return (
    <div className="glow-border bg-panel-bg backdrop-blur-md rounded-2xl p-5 w-full sm:w-80 relative z-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-cyan-200 text-sm tracking-widest font-semibold">
          OFFICER ACTIVITY
        </h3>
        <span className="flex items-center gap-1 text-cyan-400 text-xs font-bold tracking-widest">
          <CheckCircle2 size={12} />
          {members.length}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {officers.length === 0 ? (
          <p className="text-sm text-cyan-500/70 tracking-wide">
            Belum ada anggota aktif.
          </p>
        ) : (
          officers.map((officer) => {
            const activity = getOfficerActivity(officer);
            const Icon = activity.icon;
            return (
              <div key={officer.id} className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full glow-border flex items-center justify-center bg-cyan-950/50 font-display font-bold text-cyan-300 text-sm">
                    {officer.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <span className="text-cyan-100 text-sm font-medium tracking-wide truncate">
                    {officer.name}
                  </span>
                  <span className={`${activity.color} text-xs tracking-widest mt-0.5`}>
                    {activity.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] text-cyan-500/70">
                    {officer.stats.weekly_duty}d
                  </span>
                  <Icon size={16} className={activity.color} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
