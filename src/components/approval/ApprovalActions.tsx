"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { approveDutyAction, rejectDutyAction } from "@/lib/mutations/duty-actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { DutyReportWithMember } from "@/lib/supabase/queries";
import type { DutyReportStatus } from "@/types/db";

type ApprovalActionsProps = {
  report: DutyReportWithMember;
  isAdmin: boolean;
};

export function ApprovalActions({ report, isAdmin }: ApprovalActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  if (!isAdmin || report.status !== "pending") return null;

  function updateCacheStatus(status: DutyReportStatus, extra?: { reject_reason?: string }) {
    queryClient.setQueriesData<{ reports: DutyReportWithMember[] }>(
      { queryKey: ["duty-reports"] },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          reports: old.reports.map((r) =>
            r.id === report.id
              ? { ...r, status, ...extra, approved_at: new Date().toISOString() }
              : r,
          ),
        };
      },
    );
  }

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      updateCacheStatus("approved");
      const result = await approveDutyAction(report.id);
      if (result.error) {
        updateCacheStatus("pending");
        toast.error(result.error);
      } else {
        toast.success("Laporan disetujui");
      }
    });
  }

  function handleReject() {
    setError(null);
    const trimmed = reason.trim();
    if (trimmed.length < 5) {
      setError("Alasan penolakan minimal 5 karakter");
      return;
    }
    startTransition(async () => {
      updateCacheStatus("rejected", { reject_reason: trimmed });
      const result = await rejectDutyAction(report.id, trimmed);
      if (result.error) {
        updateCacheStatus("pending");
        toast.error(result.error);
      } else {
        toast.success("Laporan ditolak");
        setRejectOpen(false);
        setReason("");
      }
    });
  }

  return (
    <>
      <div className="flex gap-2 border-t border-border/40 pt-3" data-testid="approval-actions">
        <Button
          size="sm"
          variant="default"
          onClick={handleApprove}
          disabled={pending}
          data-testid="approve-btn"
        >
          <Check className="h-4 w-4" />
          Setujui
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setRejectOpen(true)}
          disabled={pending}
          data-testid="reject-btn"
        >
          <X className="h-4 w-4" />
          Tolak
        </Button>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Laporan Duty</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Alasan penolakan (min 5 karakter, maks 500)"
              maxLength={500}
              rows={3}
            />
            <p className="text-right text-xs text-muted-foreground">{reason.length}/500</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRejectOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="destructive" onClick={handleReject} disabled={pending}>
              {pending ? "Memproses..." : "Tolak Laporan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
