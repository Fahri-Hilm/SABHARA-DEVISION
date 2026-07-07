"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { DutyStats } from "@/lib/supabase/stats";

type LeftPanelProps = {
  stats: DutyStats;
};

function buildChartData(stats: DutyStats) {
  const total = stats.weekly_total || 1;
  const approved = stats.approved_count;
  const pending = stats.pending_count;
  const rejected = stats.rejected_count;
  const target = Math.max(7, Math.ceil(total / 7));
  const data = Array.from({ length: 7 }, (_, i) => {
    const base = Math.round((total / 7) * (0.6 + (i % 3) * 0.2));
    return { val: Math.max(2, base + (i === 6 ? approved % 5 : 0)) };
  });
  data.push({ val: Math.max(approved, 1) });
  return { data, total, approved, pending, rejected, target };
}

export function LeftPanel({ stats }: LeftPanelProps) {
  const { data, total, approved, pending, rejected, target } = buildChartData(stats);

  return (
    <div className="glow-border bg-panel-bg backdrop-blur-md rounded-2xl p-5 w-full sm:w-80 relative z-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-cyan-200 text-sm tracking-widest font-semibold">
          ACTIVE DUTY REPORTS
        </h3>
        <span className="flex items-center gap-2 text-green-400 text-xs font-bold tracking-widest">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
          LIVE
        </span>
      </div>

      <div className="h-32 w-full mb-6 relative">
        <div className="absolute inset-0 border-b border-cyan-500/10" />
        <div className="absolute inset-0 top-1/2 border-b border-cyan-500/10" />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="linear"
              dataKey="val"
              stroke="#00f0ff"
              strokeWidth={3}
              dot={{ r: 4, fill: "#00f0ff", strokeWidth: 2, stroke: "#060c18" }}
              activeDot={{ r: 6, fill: "#ffffff", stroke: "#00f0ff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2 text-sm tracking-widest">
        <div className="flex justify-between items-center text-cyan-200 font-semibold border-b border-cyan-500/20 pb-2">
          <span>
            TOTAL: <span className="text-cyan-400">{total}</span>
          </span>
          <span className="flex items-center gap-2 text-green-400 text-xs font-bold">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
            LIVE
          </span>
        </div>
        <div className="flex justify-between items-center text-cyan-500/80 pt-1">
          <span>APPROVED:</span>
          <span className="text-green-400">{approved}</span>
        </div>
        <div className="flex justify-between items-center text-cyan-500/80">
          <span>PENDING:</span>
          <span className="text-yellow-400">{pending}</span>
        </div>
        <div className="flex justify-between items-center text-cyan-500/80">
          <span>REJECTED:</span>
          <span className="text-red-400">{rejected}</span>
        </div>
        <div className="flex justify-between items-center text-cyan-500/80 border-t border-cyan-500/20 pt-2 mt-1">
          <span>TARGET/WEEK:</span>
          <span className="text-cyan-400">{target}</span>
        </div>
      </div>
    </div>
  );
}
