"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Member, DutyReportStatus } from "@/types/db";
import { Filter, X } from "lucide-react";

type FeedFilterProps = {
  roster: Member[];
};

const STATUS_OPTIONS: Array<{ value: "all" | DutyReportStatus; label: string }> = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Menunggu ACC" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

export function FeedFilter({ roster }: FeedFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const status = searchParams.get("status") ?? "all";
  const memberId = searchParams.get("member_id") ?? "all";
  const dateFrom = searchParams.get("date_from") ?? "";
  const dateTo = searchParams.get("date_to") ?? "";

  const activeCount = [status !== "all", memberId !== "all", dateFrom, dateTo].filter(
    Boolean,
  ).length;

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function clear() {
    router.replace(pathname);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden"
          data-testid="filter-toggle"
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      <div
        className={`${open ? "block" : "hidden"} space-y-3 rounded-lg border border-border/60 bg-card/80 p-4 lg:block`}
        data-testid="filter-panel"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Anggota</Label>
            <Select value={memberId} onValueChange={(v) => update("member_id", v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Anggota</SelectItem>
                {roster.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Dari Tanggal</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => update("date_from", e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Sampai Tanggal</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => update("date_to", e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
